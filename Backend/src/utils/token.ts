import jwt from "jsonwebtoken";

const SECRET = "devmind-secret-key"; // coloque no .env depois

export function gerarToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verificarToken(token: string): any {
  return jwt.verify(token, SECRET);
}
