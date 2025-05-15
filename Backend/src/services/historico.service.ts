import { Historico } from "../model/Historico";
import { HistoricoDao } from "../dao/historico.dao";
import e from "express";

export class HistoricoService {
  constructor(private readonly dao: HistoricoDao) {}

  public async getAllHistoricos(): Promise<{
    id: string;
    acao: string;
    entidade: string;
    usuarioId: string;
    data: Date;
  }[]> {
    try{const historicos = await this.dao.findAll();

    return historicos.map(historico => {
      const props = historico.toJSON();
      return {
        id: props.id,
        acao: props.acao,
        entidade: props.entidade,
        usuarioId: props.usuarioId,
        data: props.data,
      };
    });
  }catch (error) {
    throw new Error("Erro ao buscar historicos");
  }
  }

  public async createHistorico(acao: string, entidade: string, usuarioId: string): Promise<Historico> {
    console.log("chegou no service");
    console.log(acao, entidade, usuarioId);
    try {
      const historico = Historico.build(acao, entidade, usuarioId);
      await this.dao.save(historico);
      return historico;
    } catch (error) {
      throw new Error("Erro ao criar historico");
    }
  }
}
