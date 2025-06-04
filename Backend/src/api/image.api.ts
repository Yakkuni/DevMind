// src/api/image.api.ts

import { Api } from "./api";
import { ImageController } from "../controllers/image.controller";
import { ImageService } from "../services/image.service";
import { ImageDao } from "../dao/image.dao";
import { autenticarRequisicao } from "../utils/auth.middleware";
import { uploadMiddleware } from "../utils/upload";

export class ImageApi {
    readonly controller: ImageController;

    private constructor(private readonly api: Api) {
        const dao = new ImageDao();
        const service = new ImageService(dao);
        this.controller = new ImageController(service);
    }

    public static build(api: Api) {
        const instance = new ImageApi(api);
        instance.addRotas();
    }

    private addRotas() {
        // Rota para upload (apenas admins): single file no campo "image"
        this.api.addRota("/images", "POST", [autenticarRequisicao, uploadMiddleware.single("image")], this.controller.upload.bind(this.controller));

        // Rota pública para listar todas as imagens
        this.api.addRota("/images", "GET", [], this.controller.listAll.bind(this.controller));

        // Rota para deletar (apenas admins)
        this.api.addRota("/images/:id", "DELETE", [autenticarRequisicao], this.controller.delete.bind(this.controller));

        this.api.addRota("/count/images", "GET", [], this.controller.count.bind(this.controller))
    }
}   
