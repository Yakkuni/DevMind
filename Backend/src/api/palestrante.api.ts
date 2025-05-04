import { Api } from "./api";
import { PalestranteController } from "../controllers/palestrante.controller";
import { PalestranteDao } from "../dao/palestrante.dao";
import { PalestranteService } from "../services/palestrante.service";

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
        this.api.addRota("/palestrante", "POST", this.controller.criar.bind(this.controller));
        this.api.addRota("/palestrante", "GET", this.controller.listarTodos.bind(this.controller));
        this.api.addRota("/palestrante/:id", "GET", this.controller.buscarPorId.bind(this.controller));
        this.api.addRota("/palestrante/:id", "DELETE", this.controller.remover.bind(this.controller));
        this.api.addRota("/palestrante/:id", "PUT", this.controller.atualizar.bind(this.controller));
        this.api.addRota("/palestrante/previews", "GET", this.controller.listarPreviews.bind(this.controller));
    }
}
