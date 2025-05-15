import { Historico } from "../model/Historico";
import { HistoricoDao } from "../dao/historico.dao";
import { UserService } from "./user.service";

export class HistoricoService {
  constructor(private readonly dao: HistoricoDao, private readonly user: UserService) {}

  public async getAllHistoricos(): Promise<{
    id: string;
    acao: string;
    entidade: string;
    usuario: string;
    data: Date;
  }[]> {
    try{const historicos = await this.dao.findAll();

    return historicos.map(historico => {
      const props = historico.toJSON();
      return {
        id: props.id,
        acao: props.acao,
        entidade: props.entidade,
        usuario: props.usuario,
        data: props.data,
      };
    });
  }catch (error) {
    throw new Error("Erro ao buscar historicos");
  }
  }

  public async createHistorico(acao: string, entidade: string, usuarioId: string): Promise<Historico> {
    
    try {
      console.log(usuarioId)
      const usuario = await this.user.getUserById(usuarioId);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }
      else{
        const historico = Historico.build(acao, entidade, usuario.getNome());
        await this.dao.save(historico);
        return historico;}
    } catch (error) {
      console.error("Erro ao criar historico:", error);
      throw new Error("Erro ao criar historico");
    }
  }
}
