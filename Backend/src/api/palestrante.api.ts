import { PalestranteController } from "../controllers/palestrante.controller";
import { PalestranteDao } from "../dao/palestrante.dao";
import { Api } from "./api";

export class PalestranteApi{
    readonly palestranteController: PalestranteController;

    private constructor(readonly api: Api){
        this.palestranteController = new PalestranteController(new PalestranteDao());
    }

    public static build(api: Api){
        const userApi = new PalestranteApi(api)
        userApi.addRotas()
    }

    public addRotas(){
        this.api.addRota("/palestrante", "POST", this.palestranteController.createPalestrante.bind(this.palestranteController))
        this.api.addRota("/palestrante", "GET", this.palestranteController.getAllPalestrantes.bind(this.palestranteController))
        this.api.addRota("/palestrante/:id", "GET", this.palestranteController.getPalestranteById.bind(this.palestranteController))
        this.api.addRota("/palestrante/:id", "DELETE", this.palestranteController.deletePalestrante.bind(this.palestranteController))
        this.api.addRota("/palestrante/:id", "PUT", this.palestranteController.updatePalestrante.bind(this.palestranteController))
    }
}
