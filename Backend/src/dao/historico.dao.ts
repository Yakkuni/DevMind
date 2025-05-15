// src/dao/HistoricoDao.ts
import { PrismaClient } from '@prisma/client';
import { Historico } from '../model/Historico';

const prisma = new PrismaClient();

export class HistoricoDao {
  async findAll(): Promise<Historico[]> {
    const historicos = await prisma.historico.findMany();
    return historicos.map(h => Historico.assemble({
      id: h.id,
      acao: h.acao,
      entidade: h.entidade,
      usuario: h.usuario,
      data: h.data
    }));
  }

  async save(historico: Historico): Promise<void> {
    const { id, acao, entidade, usuario, data } = historico.toJSON();
    await prisma.historico.create({
      data: {
        id,
        acao,
        entidade,
        usuario,
        data
      }
    });
  }
}
