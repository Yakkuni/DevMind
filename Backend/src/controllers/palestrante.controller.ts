import {Request, Response} from "express";
import { Palestrante } from "../model/Palestrante";
import { PalestranteDao } from "../dao/palestrante.dao";

export class PalestranteController{

    public constructor(readonly palestranteDao: PalestranteDao){}

    public async createPalestrante(req:Request, res: Response) {
        const { nome, descricao, foto, instagram, linkedin, youtube, site } = req.body
        const palestrante:Palestrante = Palestrante.build(nome, descricao, foto, {instagram, linkedin, youtube, site})
        try{
            await this.palestranteDao.savePalestrante(palestrante)
            res.status(201).json({message: "Palestrante cadastrado com sucesso.", palestrante: palestrante.toJSON()})
        }catch(error){
            console.log({message: "Erro ao gravar palestrante: ", error})
            res.status(500).json({message: "Erro ao gravar palestrante."})
        }
    }

    public async getAllPalestrantes(req:Request, res: Response){
        try {
            const palestrantes = await this.palestranteDao.getAllPalestrantes()
            const json = palestrantes.map(p => p.toJSON())
            res.json(json)
        } catch (error) {
            res.status(500).json({message: "Erro ao buscar palestrantes."})
        }
    }

    public async getPalestranteById(req:Request, res: Response){
        try {
            const id = req.params.id
            const palestrante = await this.palestranteDao.getPalestranteById(id)

            if (!palestrante) {
                return res.status(404).json({message: "Palestrante não encontrado."})
            }

            res.json(palestrante.toJSON())
        } catch (error) {
            res.status(500).json({message: "Erro ao buscar palestrante por ID."})
        }
    }

    public async deletePalestrante(req:Request, res: Response){
        try {
            const id = req.params.id
            const deleted = await this.palestranteDao.deletePalestranteById(id)
            if (!deleted) {
                return res.status(404).json({message: "Palestrante não encontrado para deletar."})
            }
            res.json({message: "Palestrante deletado com sucesso."})
        } catch (error) {
            res.status(500).json({message: "Erro ao deletar palestrante."})
        }
    }

    public async updatePalestrante(req:Request, res: Response){
        try {
            const id = req.params.id
            const { nome, descricao, foto, instagram, linkedin, youtube, site } = req.body

            const palestranteAtualizado = Palestrante.assemble({
                id,
                nome,
                descricao,
                foto,
                redes: { instagram, linkedin, youtube, site }
            })

            const updated = await this.palestranteDao.updatePalestrante(palestranteAtualizado)

            if (!updated) {
                return res.status(404).json({message: "Palestrante não encontrado para atualizar."})
            }

            res.json({message: "Palestrante atualizado com sucesso.", palestrante: palestranteAtualizado.toJSON()})

        } catch (error) {
            res.status(500).json({message: "Erro ao atualizar palestrante."})
        }
    }
}
