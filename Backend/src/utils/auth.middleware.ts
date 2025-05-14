import { Request, Response, NextFunction } from "express";
import { verificarToken } from "./token";

export function autenticarRequisicao(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verificarToken(token);
    (req as any).usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}
