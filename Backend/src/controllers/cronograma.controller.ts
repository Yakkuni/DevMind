import { Request, Response } from "express"
import { Cronograma } from "../model/Cronograma"
import { CronogramaDao } from "../dao/cronograma.dao"

export class CronogramaController {
    public constructor(readonly dao: CronogramaDao) {}

    public async create(req: Request, res: Response) {
        try {
            const { nome, descricao, horario, local, tipo, conduzidoPor } = req.body
            const cronograma = Cronograma.build(nome, descricao, new Date(horario), local, tipo, conduzidoPor)
            await this.dao.save(cronograma)
            res.status(201).json(cronograma.props)
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar cronograma", error })
        }
    }

    public async getAll(req: Request, res: Response) {
        const result = await this.dao.getAll()
        res.json(result)
    }

    public async getById(req: Request, res: Response) {
        const cronograma = await this.dao.getById(req.params.id)
        if (!cronograma) {
            res.status(404).json({ message: "Cronograma não encontrado" })
        } else {
            res.json(cronograma)
        }
    }

    public async delete(req: Request, res: Response) {
        await this.dao.delete(req.params.id)
        res.json({ message: "Cronograma excluído com sucesso" })
    }

    public async update(req: Request, res: Response) {
        try {
            await this.dao.update(req.params.id, req.body)
            res.json({ message: "Cronograma atualizado com sucesso" })
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar", error })
        }
    }

    
}
