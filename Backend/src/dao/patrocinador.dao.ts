import { Patrocinador } from "../model/Patrocinador";
import { prisma } from "../utils/prisma";

export class PatrocinadorDao{

    async save(patrocinador: Patrocinador) {
        try {
            const { id, nome, logo, categoria, redeSocial } = patrocinador.toJSON()
            await prisma.patrocinador.create({
                data: {
                    id, 
                    nome, 
                    logo, 
                    categoria, 
                    redeSocial
                },
            })
        } catch (error) {
            throw error
        }
        
    }

    async findAll():Promise<Patrocinador[]>{

        try {
            const rows = await prisma.patrocinador.findMany();
            if(!rows){
                throw new Error("There is no Patrocinador")
            }
                return rows.map((row) =>
                    Patrocinador.assemble({
                        id: row.id,
                        nome: row.nome,
                        logo: row.logo,
                        categoria: row.categoria,
                        redeSocial: row.redeSocial
                    })
                );
        } catch (error) {
            throw error
        }
        
    }


    async findByCategoria(categoria: string):Promise<Patrocinador[]>{
        const rows = await prisma.patrocinador.findMany({where:{categoria}})

        if(!rows){
            throw new Error("There is no Patrocinador")
        }
        return rows.map((row) =>
            Patrocinador.assemble({
                id: row.id,
                nome: row.nome,
                logo: row.logo,
                categoria: row.categoria,
                redeSocial: row.redeSocial
            })
        )
    }

    async findById(id: string): Promise<Patrocinador>{
        try {
            const row = await prisma.patrocinador.findFirst({where:{id}})
            if(!row){
                throw new Error("Patrocinador with given ID does not exist.")
            }
            
            const patrocinador = Patrocinador.assemble({
                id: row.id,
                nome: row.nome,
                logo: row.logo,
                categoria: row.categoria,
                redeSocial: row.redeSocial
            })
            return patrocinador
        } catch (error) {
            throw error
        }
        
    }

    async update(patrocinador: Patrocinador){
        try {
            const { id, nome, logo, categoria, redeSocial } = patrocinador.toJSON()
            await prisma.patrocinador.update({
                where:{id},
                data:{
                    nome,
                    logo,
                    categoria,
                    redeSocial
                }
            })
        } catch (error) {
            throw error
        }
        
    }

    async delete(id: string){
        try {
            await prisma.patrocinador.delete({
                where:{id}
            })
        } catch (error) {
            throw error
        }
        

    }

}