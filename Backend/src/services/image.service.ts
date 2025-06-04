// src/api/services/image.service.ts

import path from "path";
import fs from "fs";
import { ImageDao } from "../dao/image.dao";
import { CreateImageDto } from "../dto/image.dto";
import { Image as DomainImage, Image } from "../model/Image";
import { HistoricoSaver } from "../utils/historico.saver";
import { Usuario } from "../model/Usuario";

export class ImageService {
    constructor(private readonly dao:ImageDao){}

    public async uploadAndCreate(file: Express.Multer.File, usuario: string): Promise<DomainImage> {
        // Monta a URL pública (no caso de armazenamento local)
        const url = `/uploads/${file.filename}`;

        const dto: CreateImageDto = {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url,
        };

        const image = Image.build(dto)

        // Persiste no banco
        const created = await this.dao.create(image);

        HistoricoSaver.createHistorico("adicionou", "nova imagem", usuario )

        return created;
    }

    /**
     * Retorna todas as imagens (para galeria). 
     */
    public async listAll(): Promise<DomainImage[]> {
        return this.dao.findAll();
    }

    /**
     * Deleta do banco e do disco (se for local). Caso queira S3, adapte aqui para chamar o SDK de deleteObject.
     */
    public async deleteById(id: string, usuario: string): Promise<void> {
        try{

            const img = await this.dao.findById(id);
            if (!img) {
                throw new Error("Imagem não encontrada.");
            }

            // Apaga do disco se existir
            const filePath = path.resolve(__dirname, "../../uploads", img.getFilename());
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Deleta o registro no banco
            await this.dao.deleteById(id);
            HistoricoSaver.createHistorico("apagou", "imagem", usuario)
        }catch(error){
            throw error
        }
        
    }

    public async count(): Promise<number> {
        try{
            return await this.dao.count()
        }catch(error){
            throw error
        }
    }
}
