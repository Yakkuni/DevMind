import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
    constructor(private readonly service: UserService) {}

    public async getAllUsers(req: Request, res: Response) {
        try {
        const usuarios = await this.service.getAllUsers();
        res.json(usuarios);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
  
    }

    public async getUserById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const usuario = await this.service.getUserById(id);
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    public async updateUser(req: Request, res: Response) {
        try {
            const usuarioId = ((req as any).usuario.id) as string;
            const id = req.params.id;
            const dto = req.body;
            const usuario = await this.service.updateUser(id, dto, usuarioId);
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    public async deleteUser(req: Request, res: Response) {
        try {
            const usuarioId = ((req as any).usuario.id) as string;
            const id = req.params.id;
            await this.service.deleteUser(id, usuarioId);
            res.status(204).end().json({message: "Usuário deletado com sucesso"});
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    public async getUserCount(req: Request, res: Response) {
        try {
            const count = await this.service.countUsers();
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: "Erro ao contar usuários." });
        }
    }

    public async getUserCountByCargo(req: Request, res: Response) {
        try {
        const { cargo } = req.query;

        if (!cargo || (cargo !== 'admin' && cargo !== 'common')) {
            return res.status(400).json({ message: "Cargo inválido. Use 'admin' ou 'common'." });
        }

        const count = await this.service.countUsersByCargo(cargo as 'admin' | 'common');
        res.status(200).json({ count });
        } catch (error) {
        res.status(500).json({ message: "Erro ao contar usuários por cargo." });
        }
    }


}