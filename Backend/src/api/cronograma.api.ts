import { Api } from "./api"
import { CronogramaController } from "../controllers/cronograma.controller"
import { CronogramaDao } from "../dao/cronograma.dao"

export class CronogramaApi {
    private constructor(readonly api: Api, readonly controller: CronogramaController) {}

    public static build(api: Api) {
        const controller = new CronogramaController(new CronogramaDao())
        const instance = new CronogramaApi(api, controller)
        instance.addRoutes()
    }

    private addRoutes() {
        this.api.addRota("/cronograma", "POST", this.controller.create.bind(this.controller))
        this.api.addRota("/cronograma", "GET", this.controller.getAll.bind(this.controller))
        this.api.addRota("/cronograma/:id", "GET", this.controller.getById.bind(this.controller))
        this.api.addRota("/cronograma/:id", "DELETE", this.controller.delete.bind(this.controller))
        this.api.addRota("/cronograma/:id", "PUT", this.controller.update.bind(this.controller))
    }
}
