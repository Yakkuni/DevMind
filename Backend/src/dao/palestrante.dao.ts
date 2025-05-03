import { RowDataPacket } from "mysql2"
import { Palestrante, palestrateProps} from "../model/Palestrante"
import poolCon from "../utils/connection"

export class PalestranteDao{

    public async savePalestrante(palestrante:Palestrante){

        try{
            const {props} = palestrante
            const {id, descricao, nome, foto, redes} = props
            await poolCon.query('INSERT INTO palestrantes(id, minibio, nome, foto, instagram, linkedin, youtube, site) values(?, ?, ?, ?, ?, ?, ?, ?)', [id, nome, descricao, foto, redes.instagram, redes.linkedin, redes.youtube, redes.site])
        }catch(error){
            throw error
        }

    }


}