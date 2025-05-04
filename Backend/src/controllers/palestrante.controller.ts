import { Request, Response } from "express";
import { PalestranteService } from "../services/palestrante.service";
import { CreatePalestranteDTO } from "../dto/palestrante.dto";

export class PalestranteController {
    constructor(private readonly service: PalestranteService) {}

    public async criar(req: Request, res: Response) {
        try {
            const dto: CreatePalestranteDTO = req.body;
            const palestrante = await this.service.criar(dto);
            res.status(201).json(palestrante.toJSON());
        } catch (error) {
            console.error("Erro ao criar palestrante:", error);
            res.status(500).json({ message: "Erro ao criar palestrante", error: (error as Error).message });
        }        
    }

    public async listarTodos(req: Request, res: Response) {
        const palestrantes = await this.service.listarTodos();
        res.json(palestrantes.map(p => p.toJSON()));
    }

    public async buscarPorId(req: Request, res: Response) {
        const id = req.params.id;
        const palestrante = await this.service.buscarPorId(id);
        if (!palestrante) {
            return res.status(404).json({ message: "Palestrante não encontrado" });
        }
        res.json(palestrante.toJSON());
    }

    public async remover(req: Request, res: Response) {
        const id = req.params.id;
        await this.service.remover(id);
        res.status(204).end();
    }

    public async atualizar(req: Request, res: Response) {
        const id = req.params.id;
        const dto: CreatePalestranteDTO = req.body;
        const palestrante = await this.service.atualizar(id, dto);
        if (!palestrante) {
            return res.status(404).json({ message: "Palestrante não encontrado" });
        }
        res.json(palestrante.toJSON());
    }

    public async listarPreviews(req: Request, res: Response) {
        try {
            const previews = await this.service.listarPreviews();
            res.json(previews);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar previews", error });
        }
    }
    
}
