import { PatrocinadorDao } from "../dao/patrocinador.dao";
import { HistoricoSaver } from "../utils/historico.saver";
import { Patrocinador } from "../model/Patrocinador";

export class PatrocinadorService{

    constructor(
            private readonly dao: PatrocinadorDao
        ) {}

    public async createPatrocinador(nome: string, logo: string, categoria: string, redeSocial: string, user: string): Promise<string>{
        try {
            const patrocinador = Patrocinador.build(nome, logo, categoria, redeSocial)
            await this.dao.save(patrocinador);
            await HistoricoSaver.createHistorico("criou", `o patrocinador \"${patrocinador.props.nome}\"`, user);
            return patrocinador.toJSON().id
        } catch (error) {
            throw error
        }
    }

    public async findAll():Promise<Patrocinador[]>{
        try {
            return await this.dao.findAll()
        } catch (error) {
            throw error
        }
    }


    public async findByCategoria(categoria: string):Promise<Patrocinador[]>{
        try {
            return await this.dao.findByCategoria(categoria)
        } catch (error) {
            throw error
        }
    }

    public async updatePatrocinador(id: string, nome: string, logo: string, categoria: string, redeSocial: string, user: string){
        try {
            const updatedPatrocinador = Patrocinador.assemble({id, nome, logo, categoria, redeSocial})
            await this.dao.update(updatedPatrocinador)
            await HistoricoSaver.createHistorico("editou", `o patrocinador \"${updatedPatrocinador.props.nome}\"`, user);
        } catch (error) {
            throw error
        }
    }

    public async deletePatrocinador(id:string, user: string){
        try {
            const patrocinador = await this.dao.findById(id)
            await this.dao.delete(id)
            await HistoricoSaver.createHistorico("apagou", `o patrocinador \"${patrocinador.props.nome}\"`, user);
        } catch (error) {
            throw error
        }
    }
}