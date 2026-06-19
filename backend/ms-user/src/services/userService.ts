import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";
import { sendMail } from "../utils/mailer.js";
import { logger } from "../utils/logger.js";

// - JWT Secret config -

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "8h";

if (!JWT_SECRET) throw new apiErr.JwtError();

// - Helper functions -

function generateRefreshToken(): string {
	return crypto.randomBytes(128).toString("hex");
}

function hashToken(token: string): string {
	return crypto.createHash("sha256").update(token).digest("hex");
}

function refreshExpiresAt(): Date {
	const d = new Date();
	d.setDate(d.getDate() + 7); //tokens last for 7 days
	return d;
}

// - User Service - Service class to handle the business logic of the user module

export class UserService {
	async createUser(input: schemas.RegisterUserInput) {
		const { password, ...userData } = input;

		const hashedPassword = await bcrypt.hash(input.password, 10);

		const user = await prisma.user.create({
			data: {
				...userData,
				passwordHash: hashedPassword,
			},
		});

		const payload: Record<string, unknown> = {
			sub: user.id,
			roleId: user.role,
		};

		const token = jwt.sign(payload, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		await prisma.refreshToken.create({
			data: {
				userId: user.id,
				tokenHash: hashToken(token),
				expires_at: refreshExpiresAt(),
			},
		});

		const { passwordHash, ...userWithoutPassword } = user;

		return {
			user: userWithoutPassword,
			accessToken: token,
			refreshToken: token,
			expiresIn: JWT_EXPIRES_IN,
		};
	}

	async loginUser(input: schemas.LoginInput) {
		const user = await prisma.user.findUnique({
			where: { email: input.email },
		});

		if (!user)
			throw new apiErr.InvalidCredentialsError(
				"Invalid email or password.",
			);

		const match = await bcrypt.compare(input.password, user.passwordHash);

		if (!match)
			throw new apiErr.InvalidCredentialsError(
				"Invalid email or password.",
			);

		const payload: Record<string, unknown> = {
			sub: user.id,
			roleId: user.role,
		};

		const accessToken = jwt.sign(payload, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		// Generate and store refresh token (lasts 7 days)
		const refreshToken = generateRefreshToken();
		const refreshTokenHash = hashToken(refreshToken);

		await prisma.refreshToken.create({
			data: {
				userId: user.id,
				tokenHash: refreshTokenHash,
				expires_at: refreshExpiresAt(),
			},
		});

		const { passwordHash, ...userWithoutPassword } = user;

		return {
			user: userWithoutPassword,
			accessToken: accessToken,
			refreshToken: refreshToken,
			expiresIn: JWT_EXPIRES_IN,
		};
	}

	async refreshToken(oldToken: string) {
		const oldTokenHash = hashToken(oldToken);

		const storedToken = await prisma.refreshToken.findFirst({
			where: {
				tokenHash: oldTokenHash,
				revoked: false,
			},
			include: { user: true },
		});

		if (!storedToken)
			throw new apiErr.InvalidCredentialsError(
				"Invalid or expired refresh token.",
			);

		const user = storedToken.user;

		const payload: Record<string, unknown> = {
			sub: user.id,
			roleId: user.role,
		};

		const newAccessToken = jwt.sign(payload, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		// Generate new token
		const newToken = generateRefreshToken();
		const newTokenHash = hashToken(newToken);

		// Revoke old token
		await prisma.refreshToken.update({
			where: { id: storedToken.id },
			data: { revoked: true },
		});

		// Store new token
		await prisma.refreshToken.create({
			data: {
				userId: user.id,
				tokenHash: newTokenHash,
				expires_at: refreshExpiresAt(),
			},
		});

		return {
			accessToken: newAccessToken,
			refreshToken: newToken,
			expiresIn: JWT_EXPIRES_IN,
		};
	}

	async logoutUser(refreshToken: string) {
		const tokenHash = hashToken(refreshToken);

		const storedToken = await prisma.refreshToken.findFirst({
			where: {
				tokenHash: tokenHash,
				revoked: false,
			},
		});

		if (!storedToken)
			throw new apiErr.InvalidCredentialsError("Invalid refresh token.");

		await prisma.refreshToken.update({
			where: { id: storedToken.id },
			data: { revoked: true },
		});
	}

	async getUserById(userId: string) {
		return await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
				position: true,
				created_at: true,
				passwordHash: false,
			},
		});
	}

	async getUsersByRole(role: string) {
		return await prisma.user.findMany({
			where: { role },
			select: {
				id: true,
				name: true,
			},
		});
	}

	async getUsers() {
		return await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				position: true,
				role: true,
				created_at: true,
				passwordHash: false,
			},
		});
	}

	async updateUser(userId: string, input: schemas.UpdateInput) {
		return await prisma.user.update({
			where: { id: userId },
			data: { ...input },
		});
	}

	async deleteUser(userId: string) {
		await prisma.user.delete({
			where: { id: userId },
		});
	}

	// - Password reset flow -

	async requestPasswordReset(websiteUrl: string, email: string) {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return; // Não revele que o usuário não existe
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		const passwordResetToken = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex");

		const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // Lasts 10 minutes

		await prisma.user.update({
			where: { id: user.id },
			data: {
				resetPasswordToken: passwordResetToken,
				resetPasswordTokenExpiresAt: passwordResetExpires,
			},
		});

		logger.info(
			`Link for password reset for ${email}: http://${websiteUrl}/reset-password?token=${resetToken} (valid for 10 minutes)`,
		);

		// Send email with reset link (in production, use a proper email service)

		//await sendMail(
		//  {
		//    to: user.email,
		//    subject: "Password Recovery",
		//    text: `Click to reset your password: http://${websiteUrl}/reset-password?token=${resetToken}`
		//  }
		//)
	}

	async resetPassword(token: string, password: string) {
		const hashedToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const user = await prisma.user.findFirst({
			where: {
				resetPasswordToken: hashedToken,
				resetPasswordTokenExpiresAt: { gt: new Date() },
			},
		});

		if (!user) {
			throw new Error("Token inválido ou expirado");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: { id: user.id },
			data: {
				passwordHash: hashedPassword,
				resetPasswordToken: null,
				resetPasswordTokenExpiresAt: null,
			},
		});
	}
}
