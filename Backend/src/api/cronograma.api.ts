import { Api } from "./api";
import { CronogramaController } from "../controllers/cronograma.controller";
import { CronogramaDao } from "../dao/cronograma.dao";
import { CronogramaService } from "../services/cronograma.service";

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
        this.api.addRota("/cronograma", "POST", this.controller.create.bind(this.controller));
        this.api.addRota("/cronograma", "GET", this.controller.getAll.bind(this.controller));
        this.api.addRota("/cronograma/:id", "GET", this.controller.getById.bind(this.controller));
        this.api.addRota("/cronograma/:id", "DELETE", this.controller.delete.bind(this.controller));
        this.api.addRota("/cronograma/:id", "PUT", this.controller.update.bind(this.controller));
        this.api.addRota("/cronograma/dia/:data", "GET", this.controller.getByDia.bind(this.controller));
    }
}
