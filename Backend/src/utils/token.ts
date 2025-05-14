import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET não está definido no arquivo .env");
}

export function gerarToken(payload: object): string {
  return jwt.sign(payload, SECRET as string, { expiresIn: "3h" });
}

export function verificarToken(token: string): any {
  return jwt.verify(token, SECRET as string);
}
