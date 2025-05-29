import { Request, Response } from "express";
import { PatrocinadorService } from "../services/patrocinador.service";

export class PatrocinadorController{
    constructor(private readonly service:PatrocinadorService){}

    public async createPatrocinador(req: Request, res: Response){
        try {
            const usuarioId = ((req as any).usuario.id) as string;
            const {nome, logo, categoria, redeSocial} = req.body
            const id = await this.service.createPatrocinador(nome, logo, categoria, redeSocial, usuarioId)
            res.status(201).json({ message: "Patrocinador criado com sucesso.", id });
        } catch (error) {
            res.status(500).json({message: "Erro ao criar patrocinador.", error})
        }
    }

    public async findAllPatrocinadores(req: Request, res: Response){
        try{
            const patrocinadores = await this.service.findAll()
            res.status(201).json(patrocinadores)
        }catch(error){
            res.status(500).json({message: "Erro ao buscar patrocinadores.", error})
        }
    }

    public async findByCategory(req: Request, res:Response){
        try{
            const { categoria } = req.query;
            if (typeof categoria !== "string") {
                return res.status(400).json({ message: "Categoria inválida ou não informada." });
            }
            const result = await this.service.findByCategoria(categoria);
            res.status(200).json(result);
        } catch(error){
            res.status(500).json({message: "Erro ao buscar patrocinadores.", error})
        }
    }

    public async delete(req: Request, res:Response){
        try {
            const {id} = req.params
            const usuarioId = ((req as any).usuario.id) as string;

            if (typeof id !== "string") {
                return res.status(400).json({ message: "ID inválido ou não informado." });
            }

            await this.service.deletePatrocinador(id, usuarioId)

            res.status(201).json({message:"Patrocinador deletado com sucesso"})
        } catch (error) {
            res.status(500).json({message:"Erro ao deletar patrocinador", error})
        }
    }

    public async updatePatrocinador(req: Request, res:Response){
        try {
            const {id} = req.params
            const {nome, logo, categoria, redeSocial} = req.body
            const usuarioId = ((req as any).usuario.id) as string;

            await this.service.updatePatrocinador(id, nome, logo, categoria, redeSocial, usuarioId)

            res.status(201).json({message:"Patrocinador editado com sucesso."})
        } catch (error) {
            res.status(500).json({message:"Erro ao editar patrocinador", error})
        }
    }

}