import { Request, Response } from "express";
import { CronogramaService } from "../services/cronograma.service";

export class CronogramaController {
    constructor(private readonly service: CronogramaService) {}

    public async create(req: Request, res: Response) {
        try {
            const usuarioId = ((req as any).usuario.id) as string;
            const { nome, descricao, horario, local, tipo, conduzidoPor } = req.body;
            const cronograma = await this.service.create({ nome, descricao, horario, local, tipo, conduzidoPor }, usuarioId);
            res.status(201).json(cronograma.props);
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar cronograma", error });
        }
    }

    public async getAll(req: Request, res: Response) {
        const cronogramas = await this.service.getAll();
        res.json(cronogramas.map(c => c.props));
    }

    public async getById(req: Request, res: Response) {
        const cronograma = await this.service.getById(req.params.id);
        if (!cronograma) {
            return res.status(404).json({ message: "Cronograma não encontrado" });
        }
        res.json(cronograma.props);
    }

    public async delete(req: Request, res: Response) {
        const usuarioId = (req as any).usuario.id;
        await this.service.delete(req.params.id, usuarioId);
        res.status(204).end();
    }

    public async update(req: Request, res: Response) {
        try {
            const usuarioId = (req as any).usuario.id;
            await this.service.update(req.params.id, req.body, usuarioId);
            res.json({ message: "Cronograma atualizado com sucesso" });
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar", error });
        }
    }

    // Novo método para buscar cronogramas por dia
    public async getByDia(req: Request, res: Response) {
        const data = req.params.data;
        try {
            const cronogramas = await this.service.getByDia(data);
            res.json(cronogramas.map(c => c.props));
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar cronogramas para o dia", error });
        }
    }

    public async count(req: Request, res: Response){
        try {
            const count = await this.service.count();
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: "Erro interno.", error })
        }
        
    }
}
