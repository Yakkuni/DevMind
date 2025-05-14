import { Request, Response, NextFunction } from "express";
import { verificarToken } from "./token";
import { UsuarioDao } from "../dao/usuario.dao";


const userDao = new UsuarioDao();

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

export async function autenticarAdmin(req: Request, res: Response, next: NextFunction) {
  const usuarioToken = (req as any).usuario;

  if (!usuarioToken || !usuarioToken.id) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  try {
    const usuarioDb = await userDao.findById(usuarioToken.id);

    if (!usuarioDb) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    if (usuarioDb.getCargo() !== "admin") {
      return res.status(403).json({ message: "Acesso negado" });
    }

    // se quiser passar o usuário completo para os próximos handlers
    (req as any).usuarioCompleto = usuarioDb;

    next();
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
