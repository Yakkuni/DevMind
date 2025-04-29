import { RowDataPacket } from "mysql2"
import { Palestrante, palestrateProps} from "../model/Palestrante"
import poolCon from "../utils/connection"

export class PalestranteDao{

    public async savePalestrante(palestrante:Palestrante){

        try{
            const {props} = palestrante
            const {id, descricao, nome, foto, redes} = props
            await poolCon.query('INSERT INTO palestrante(id, descricao, nome, foto, instagram, linkedin, youtube, site) values(?, ?, ?, ?, ?, ?, ?, ?)', [id, nome, descricao, foto, redes.instagram, redes.linkedin, redes.youtube, redes.site])
        }catch(error){
            throw error
        }

    }

    public async getPalestrantes(){

        try{
            
            const [result] = await poolCon.query<palestrateProps[] & RowDataPacket[]>('SELECT * FROM palestrante')

            const palestrantes:Palestrante[] = result.map((palestrante) => {
                const { id, nome, foto, descricao, instagram, linkedin, youtube, site } = palestrante
                return Palestrante.assemble(id, nome, descricao, foto, {instagram, linkedin, youtube, site})
            })

            return livros
        }catch(error){
            console.log({message: "Erro ao listar livros: ", error})
            throw error
        }
    }

}