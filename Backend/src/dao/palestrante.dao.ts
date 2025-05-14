// src/dao/PalestranteDao.ts
import { PrismaClient } from '@prisma/client';
import { Palestrante as PalestranteModel } from '../model/Palestrante'; // sua classe domain, se quiser manter
const prisma = new PrismaClient();

export class PalestranteDao {
  async save(palestrante: PalestranteModel) {
    const { id, nome, descricao, foto, redes } = palestrante.toJSON();
    await prisma.palestrante.create({
      data: {
        id,
        nome,
        minibio: descricao,
        foto,
        instagram: redes.instagram,
        linkedin: redes.linkedin,
        youtube: redes.youtube,
        site: redes.site,
      }
    });
  }

  async findAll(): Promise<PalestranteModel[]> {
    const palestrantes = await prisma.palestrante.findMany();
    return palestrantes.map(p => PalestranteModel.assemble({
      id: p.id,
      nome: p.nome,
      descricao: p.minibio,
      foto: p.foto,
      redes: {
        instagram: p.instagram,
        linkedin: p.linkedin,
        youtube: p.youtube,
        site: p.site
      }
    }));
  }

  async findById(id: string): Promise<PalestranteModel | null> {
    const p = await prisma.palestrante.findUnique({ where: { id } });
    if (!p) return null;
    return PalestranteModel.assemble({
      id: p.id,
      nome: p.nome,
      descricao: p.minibio,
      foto: p.foto,
      redes: {
        instagram: p.instagram,
        linkedin: p.linkedin,
        youtube: p.youtube,
        site: p.site
      }
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.palestrante.delete({ where: { id } });
  }

  async update(palestrante: PalestranteModel): Promise<void> {
    const { id, nome, descricao, foto, redes } = palestrante.toJSON();
    await prisma.palestrante.update({
      where: { id },
      data: {
        nome,
        minibio: descricao,
        foto,
        instagram: redes.instagram,
        linkedin: redes.linkedin,
        youtube: redes.youtube,
        site: redes.site
      }
    });
  }
}
