import {Request, Response} from "express";
import { Palestrante } from "../model/Palestrante";
import { PalestranteDao } from "../dao/palestrante.dao";

export class PalestranteControl{

    public constructor(readonly palestranteDao: PalestranteDao){}

    public async createPalestrante(req:Request, res: Response) {
        const { nome, descricao, foto, instagram, linkedin, youtube, site } = req.body
        const palestrante:Palestrante = Palestrante.build(nome, descricao, foto, {instagram, linkedin, youtube, site})
        try{
            this.palestranteDao.savePalestrante(palestrante)
            res.status(201).json({message: "Palestrante cadastrado com sucesso.", palestrante})
        }catch(error){
            console.log({message: "Erro ao gravar palestrante: ", error})
        }
    }
}