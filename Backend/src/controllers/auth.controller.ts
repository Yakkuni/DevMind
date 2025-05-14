// controllers/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  // Rota de login
  public async login(req: Request, res: Response) {
    try {
      const token = await this.service.autenticar(req.body);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  }

  // Rota de registro
  public async register(req: Request, res: Response) {
    const { nome, email, cargo, senha } = req.body;
    try {
      await this.service.registrar(nome, email, cargo, senha);
      res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  public async me(req: Request, res: Response) {
  try {
    const usuario = (req as any).usuario; // Foi inserido pelo middleware
    res.json({ usuario });
  } catch (error) {
    res.status(401).json({ message: "Não autenticado" });
  }
}
}
