import { HistoricoDao } from "../dao/historico.dao";
import { UsuarioDao } from "../dao/usuario.dao";
import { HistoricoService } from "../services/historico.service";
import { UserService } from "../services/user.service";

export class HistoricoSaver {
  private static historico: HistoricoService;

  private constructor(historico: HistoricoService) {
    HistoricoSaver.historico = historico;
  }

  public static createHistorico(
    acao: string,
    entidade: string,
    usuario: string
    ): void {
    if (!HistoricoSaver.historico) {
      HistoricoSaver.historico = new HistoricoService(new HistoricoDao(), new UserService(new UsuarioDao()));
    }
    HistoricoSaver.historico.createHistorico(acao, entidade, usuario).catch(
      (error) => {
        console.error("Erro ao criar historico:", error);
        throw new Error("Erro ao criar historico");
      }
    );

    }
}