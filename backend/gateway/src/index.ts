import express, { Request, Response, NextFunction } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import { logger } from "./utils/logger.js";
import * as config from "./utils/importer.js";

const app = express();

interface JwtPayload {
	sub: string;
	roleId: string;
}

// - Validate essential environment variables at startup -

if (!config.port) {
	logger.error("PORT is not defined in environment variables.");
	process.exit(1);
}

if (!config.jwtSecret) {
	logger.error("JWT_SECRET is not defined in environment variables.");
	process.exit(1);
}

if (!config.url_user || !config.url_client || !config.url_item) {
	logger.error(
		"One or more service URLs (USER_URL, PRODUCT_URL, ORDER_URL) are not defined in environment variables.",
	);
	process.exit(1);
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

// - Helmet - helps secure Express apps by setting various HTTP headers

app.use(helmet());

// - CORS - enables Cross-Origin Resource Sharing

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			if (!config.allowOrigins) return callback(null, true);

			if (config.allowOrigins.split(",").includes(origin)) {
				return callback(null, true);
			}
			logger.warn(`Blocked CORS request from origin: ${origin}`);
			return callback(new Error("Not allowed by CORS"));
		},
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
		maxAge: 3600,
	}),
);

// - Body Parser - parses incoming request bodies in a middleware before your handlers, available under the req.body property

app.use(express.json({ limit: "10mb" }));
app.set("trust proxy", 1);

// - Rate Limiting - limits repeated requests to public APIs and/or endpoints

// const limiter = rateLimit({
// 	windowMs: 10 * 60 * 1000, // 10 minutes
// 	max: 100, // limit each IP to 100 requests per windowMs
// 	standardHeaders: true,
// 	legacyHeaders: false,
// 	message: "Too many requests from this IP, please try again later.",
// });

// app.use(limiter);

// - JWT Authentication Middleware - verifies JWT token and attaches user info to request

function authenticate(req: Request, res: Response, next: NextFunction) {
	// Remove headers
	delete req.headers["x-user-id"];
	delete req.headers["x-role-id"];

	const header = req.headers["authorization"];
	if (header?.startsWith("Bearer ")) {
		try {
			req.user = jwt.verify(
				header.split(" ")[1],
				config.jwtSecret,
			) as JwtPayload;
		} catch (err: any) {
			logger.warn(`Invalid JWT token: ${err.message}`);
			res.status(401).json({ message: "Invalid token" });
			return;
		}
	}
	next();
}

function injectHeaders(req: Request, _res: Response, next: NextFunction) {
	if (req.user) {
		req.headers["x-user-id"] = req.user.sub;
		req.headers["x-role-id"] = req.user.roleId;
	}
	next();
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
	if (!req.user) {
		res.status(401).json({ error: "Authentication required!" });
		return;
	}
	next();
}

// - Proxy Middleware - forwards requests to respective microservices

const userProxy = createProxyMiddleware({
	target: config.url_user,
	changeOrigin: true,
	pathRewrite: { "^/api/users": "" },
	on: {
		proxyReq: (proxyReq, req, res) => {
			if (req.headers.authorization) {
				proxyReq.setHeader("Authorization", req.headers.authorization);
			}
			fixRequestBody(proxyReq, req);
		},
		error: (_err, _req, res) => {
			logger.error(`Error proxying to User Service: ${_err.message}`);
			(res as Response)
				.status(500)
				.json({ message: "ms-user is unavailable." });
		},
	},
});

const itemProxy = createProxyMiddleware({
	target: config.url_item,
	changeOrigin: true,
	pathRewrite: { "^/api/items": "" },
	on: {
		proxyReq: (proxyReq, req, res) => {
			if (req.headers.authorization) {
				proxyReq.setHeader("Authorization", req.headers.authorization);
			}
			fixRequestBody(proxyReq, req);
		},
		error: (_err, _req, res) => {
			logger.error(`Error proxying to Item Service: ${_err.message}`);
			(res as Response)
				.status(500)
				.json({ message: "ms-item is unavailable." });
		},
	},
});

const clientProxy = createProxyMiddleware({
	target: config.url_client,
	changeOrigin: true,
	pathRewrite: { "^/api/clients": "" },
	on: {
		proxyReq: (proxyReq, req, res) => {
			if (req.headers.authorization) {
				proxyReq.setHeader("Authorization", req.headers.authorization);
			}
			fixRequestBody(proxyReq, req);
		},
		error: (_err, _req, res) => {
			logger.error(`Error proxying to Client Service: ${_err.message}`);
			(res as Response)
				.status(500)
				.json({ message: "ms-client is unavailable." });
		},
	},
});

app.use("/api/users", authenticate, injectHeaders, userProxy);

app.use("/api/items", authenticate, injectHeaders, itemProxy); // Remeber to add requireAuth!!!

app.use("/api/clients", authenticate, injectHeaders, clientProxy); // Remeber to add requireAuth!!!

// - 404 Handler - catches unmatched routes

app.use((_req, res) => {
	logger.warn(`Route not found: ${_req.method} ${_req.originalUrl}`);
	res.status(404).json({ error: "Route not found." });
});

// - Global Error Handler - catches all errors

app.use((err: any, _req: Request, res: Response) => {
	logger.error(`Internal server error: ${err.message}`);
	res.status(500).json({ error: "Internal server error." });
});

// - Health Check Endpoint - simple endpoint to verify service health

app.get("/health", (_req, res) => {
	res.json({
		status: "healthy",
		service: "gateway",
	});
});

// - Start the server -

app.listen(config.port, () => {
	logger.info(`listening on port: ${config.port}`);
	logger.info(`ms-user          → ${config.url_user}`);
	logger.info(`ms-item          → ${config.url_item}`);
	logger.info(`ms-client        → ${config.url_client}`);
	logger.info(`cors allowed     → ${config.allowOrigins!}`);
});
