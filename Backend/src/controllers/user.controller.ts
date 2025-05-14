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
            const id = req.params.id;
            const dto = req.body;
            const usuario = await this.service.updateUser(id, dto);
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    public async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await this.service.deleteUser(id);
            res.status(204).end().json({message: "Usuário deletado com sucesso"});
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }


}