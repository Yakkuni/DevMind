// palestrantes.api.ts
import { Api } from "./api";
import { PalestranteController } from "../controllers/palestrante.controller";
import { PalestranteDao } from "../dao/palestrante.dao";
import { PalestranteService } from "../services/palestrante.service";
import { autenticarRequisicao } from "../utils/auth.middleware"; // Importa o middleware


export class PalestranteApi {
    readonly controller: PalestranteController;

    private constructor(private readonly api: Api) {
        const dao = new PalestranteDao();
        const service = new PalestranteService(dao);
        this.controller = new PalestranteController(service);
    }

    public static build(api: Api) {
        const instance = new PalestranteApi(api);
        instance.addRotas();
    }

    private addRotas() {
        // Rota protegida (requere autenticação)
        this.api.addRota("/palestrante", "POST", [autenticarRequisicao], this.controller.criar.bind(this.controller)); // Passa o middleware como um array
        this.api.addRota("/palestrante/:id", "DELETE", [autenticarRequisicao], this.controller.remover.bind(this.controller)); // Passa o middleware como um array
        this.api.addRota("/palestrante/:id", "PUT", [autenticarRequisicao], this.controller.atualizar.bind(this.controller)); // Passa o middleware como um array
        this.api.addRota("/palestrante/lote", "POST", [autenticarRequisicao], this.controller.criarEmLote.bind(this.controller)); // Passa o middleware como um array

        
        this.api.addRota("/palestrante/previews", "GET", [], this.controller.listarPreviews.bind(this.controller)); // Rota GET não protegida
        this.api.addRota("/palestrante", "GET", [], this.controller.listarTodos.bind(this.controller)); // Rota GET não protegida
        this.api.addRota("/palestrante/:id", "GET", [], this.controller.buscarPorId.bind(this.controller)); // Rota GET não protegida
    }
}
