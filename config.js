import dotenv from "dotenv";
dotenv.config();

export const POSTGRESQL_URL = process.env.POSTGRESQL_URL;
export const PORT = process.env.PORT;
export const TU_API_KEY = process.env.TU_API_KEY;
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
