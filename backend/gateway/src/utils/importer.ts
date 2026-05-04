import "dotenv/config";

export const port = process.env.PORT;
export const jwtSecret = process.env.JWT_SECRET!;
export const allowOrigins = process.env.ALLOW_ORIGINS;

export const url_user = process.env.USER_URL;
export const url_client = process.env.PRODUCT_URL;
export const url_item = process.env.ORDER_URL;
