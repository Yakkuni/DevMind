import { Request, Response } from "express";
import { Even3Service } from "../services/Even3.service";

export class Even3Controller {
    constructor(private readonly service: Even3Service) {}

    /**
     * Manipulador da rota GET /eventos.
     * Busca os eventos da Even3 e os retorna como uma resposta JSON.
     */
    public async getEven3Events(req: Request, res: Response): Promise<Response> {
        try {
            console.log("CONTROLLER: Rota GET /eventos foi chamada.");
            const data = await this.service.fetchAllEvents();
            return res.status(200).json(data);
        } catch (error) {
            // O erro lançado pelo serviço é capturado aqui
            return res.status(500).json({ 
                message: 'Erro ao buscar dados dos eventos externos.', 
                detail: (error as Error).message 
            });
        }
    }
}