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
        
    }
}