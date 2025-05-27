// cronograma.api.ts
import { Api } from "./api";
import { CronogramaController } from "../controllers/cronograma.controller";
import { CronogramaDao } from "../dao/cronograma.dao";
import { CronogramaService } from "../services/cronograma.service";
import { autenticarRequisicao } from "../utils/auth.middleware";

export class CronogramaApi {
    private constructor(private readonly api: Api, private readonly controller: CronogramaController) {}

    public static build(api: Api) {

        const dao = new CronogramaDao();
        const service = new CronogramaService(dao);
        const controller = new CronogramaController(service);
        const instance = new CronogramaApi(api, controller);
        instance.addRoutes();
    }

    private addRoutes() {
        // Rotas protegidas
        this.api.addRota("/cronograma", "POST", [], this.controller.create.bind(this.controller)); // Criação de cronograma
        this.api.addRota("/cronograma/:id", "DELETE", [autenticarRequisicao], this.controller.delete.bind(this.controller)); // Deletar cronograma
        this.api.addRota("/cronograma/:id", "PUT", [autenticarRequisicao], this.controller.update.bind(this.controller)); // Atualizar cronograma
        
        // Rotas não protegidas (GET)
        this.api.addRota("/cronograma", "GET", [], this.controller.getAll.bind(this.controller)); // Listar cronogramas
        this.api.addRota("/cronograma/:id", "GET", [], this.controller.getById.bind(this.controller)); // Buscar cronograma por ID
        this.api.addRota("/cronograma/dia/:data", "GET", [], this.controller.getByDia.bind(this.controller)); // Buscar cronograma por data
        this.api.addRota("/cronograma/count", "GET", [autenticarRequisicao], this.controller.count.bind(this.controller))
    }
}
