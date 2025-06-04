// src/api/dao/image.dao.ts

import { Image as DomainImage, Image } from "../model/Image";
import { prisma } from "../utils/prisma";

export class ImageDao {
  // Cria um novo registro de imagem
    async create(data: Image): Promise<DomainImage> {
        const created = await prisma.image.create({
        data: {
            id: data.getId(),
            filename: data.getFilename(),
            originalName: data.getOriginalName(),
            mimeType: data.getMimeType(),
            size: data.getSize(),
            url: data.getUrl(),
        },
        });

        // Monta a entidade de domínio a partir do que o Prisma retornou
        return DomainImage.assemble({
        id: created.id,
        filename: created.filename,
        originalName: created.originalName,
        mimeType: created.mimeType,
        size: created.size,
        url: created.url,
        createdAt: created.createdAt,
        });
    }

    // Busca todas as imagens (ordenadas por data de criação decrescente)
    async findAll(): Promise<DomainImage[]> {
        const imgs = await prisma.image.findMany({
        orderBy: { createdAt: "desc" },
        });
        return imgs.map((i) =>
        DomainImage.assemble({
            id: i.id,
            filename: i.filename,
            originalName: i.originalName,
            mimeType: i.mimeType,
            size: i.size,
            url: i.url,
            createdAt: i.createdAt,
        })
        );
    }

    // Busca uma imagem por id
    async findById(id: string): Promise<DomainImage | null> {
        const img = await prisma.image.findUnique({ where: { id } });
        if (!img) return null;
        return DomainImage.assemble({
        id: img.id,
        filename: img.filename,
        originalName: img.originalName,
        mimeType: img.mimeType,
        size: img.size,
        url: img.url,
        createdAt: img.createdAt,
        });
    }

    // Deleta um registro de imagem (e retorna a entidade deletada, se quiser usar algo)
    async deleteById(id: string): Promise<DomainImage> {
        const deleted = await prisma.image.delete({ where: { id } });
        return DomainImage.assemble({
        id: deleted.id,
        filename: deleted.filename,
        originalName: deleted.originalName,
        mimeType: deleted.mimeType,
        size: deleted.size,
        url: deleted.url,
        createdAt: deleted.createdAt,
        });
    }

    async count(): Promise<number>{
        return await prisma.image.count()
    }
}
