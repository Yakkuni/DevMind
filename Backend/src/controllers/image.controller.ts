// src/api/controllers/image.controller.ts

import { Request, Response, NextFunction } from "express";
import { ImageService } from "../services/image.service";

export class ImageController {
    constructor(private readonly service: ImageService) {}

    
    public async upload(req: Request, res: Response) {
        try {
        if (!req.file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado." });
        }
        const usuarioId = ((req as any).usuario.id) as string;
        const created = await this.service.uploadAndCreate(req.file, usuarioId);
        // Retorna JSON da imagem criada
            return res.status(201).json(created.toJSON());
        } catch (error) {
            console.error("Erro ao fazer upload de imagem:", (error as Error).message);
            return res.status(500).json({ message: "Erro interno ao fazer upload", error: (error as Error).message });
        }
    }


    public async listAll(req: Request, res: Response) {
        try {
        const imgs = await this.service.listAll();
        // Mapea para JSON puro
        return res.json(imgs.map((i) => i.toJSON()));
        } catch (error) {
        console.error("Erro ao listar imagens:", (error as Error).message);
        return res.status(500).json({ message: "Erro interno ao listar" });
        }
    }

    /**
     * DELETE /images/:id
     * Rota protegida (admin): exclui uma imagem por ID.
     */
    public async delete(req: Request, res: Response) {
        try {
        const id = String(req.params.id);
        const usuarioId = ((req as any).usuario.id) as string;
        await this.service.deleteById(id, usuarioId);
        return res.status(204).end();
        } catch (error) {
        console.error("Erro ao deletar imagem:", (error as Error).message);
        return res.status(500).json({ message: "Erro interno ao deletar", error: (error as Error).message });
        }
    }

    public async count(req: Request, res: Response) {
        try{
            const count = await this.service.count()
            res.status(200).json({images: count})
        }catch(error){
            res.status(500).json({ message: "Erro ao contar imagens." })
        }
    }
}
