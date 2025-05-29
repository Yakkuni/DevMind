import { Api } from "./api";
import { autenticarRequisicao } from "../utils/auth.middleware"; // Importa o middleware
import { PatrocinadorController } from "../controllers/patrocinador.controller";
import { PatrocinadorDao } from "../dao/patrocinador.dao";
import { PatrocinadorService } from "../services/patrocinador.service";


export class PatrocinadorApi {
    readonly controller: PatrocinadorController;

    private constructor(private readonly api: Api) {
        const dao = new PatrocinadorDao();
        const service = new PatrocinadorService(dao);
        this.controller = new PatrocinadorController(service);
    }

    public static build(api: Api) {
        const instance = new PatrocinadorApi(api);
        instance.addRotas();
    }

    private addRotas() {
        this.api.addRota("/patrocinador", "GET", [], this.controller.findAllPatrocinadores.bind(this.controller));
        this.api.addRota("/patrocinador/categoria/", "GET", [], this.controller.findByCategory.bind(this.controller));

        this.api.addRota("/patrocinador", "POST", [autenticarRequisicao], this.controller.createPatrocinador.bind(this.controller))
        this.api.addRota("/patrocinador/:id", "DELETE", [autenticarRequisicao], this.controller.delete.bind(this.controller))
        this.api.addRota("/patrocinador/:id", "PUT", [autenticarRequisicao], this.controller.updatePatrocinador.bind(this.controller))
    }
}
