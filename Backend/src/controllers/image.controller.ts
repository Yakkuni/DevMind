// src/api/controllers/image.controller.ts

import { Request, Response } from "express";
import { ImageService } from "../services/image.service";

export class ImageController {
    constructor(private readonly service: ImageService) {}

    public async upload(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Nenhum arquivo enviado." });
            }

            // --- MUDANÇA PRINCIPAL AQUI ---
            // Lemos o nome customizado da URL (req.query) em vez do corpo do formulário.
            // O fallback para o nome original do arquivo continua como garantia.
            const customName = req.query.originalName as string || req.file.originalname;

            const usuarioId = ((req as any).usuario.id) as string;

            const created = await this.service.uploadAndCreate(req.file, usuarioId, customName);
            
            return res.status(201).json(created.toJSON());
        } catch (error) {
            console.error("Erro detalhado no upload de imagem:", error);
            return res.status(500).json({ 
                message: "Erro interno ao fazer upload", 
                error: (error as Error).message 
            });
        }
    }

    // --- O restante do controller permanece o mesmo ---
    public async listAll(req: Request, res: Response) {
        try {
            const imgs = await this.service.listAll();
            return res.json(imgs.map((i) => i.toJSON()));
        } catch (error) {
            return res.status(500).json({ message: "Erro interno ao listar" });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const id = String(req.params.id);
            const usuarioId = ((req as any).usuario.id) as string;
            await this.service.deleteById(id, usuarioId);
            return res.status(204).end();
        } catch (error) {
            return res.status(500).json({ message: "Erro interno ao deletar" });
        }
    }

    public async count(req: Request, res: Response) {
        try {
            const count = await this.service.count();
            res.status(200).json({ images: count });
        } catch (error) {
            res.status(500).json({ message: "Erro ao contar imagens." });
        }
    }
}