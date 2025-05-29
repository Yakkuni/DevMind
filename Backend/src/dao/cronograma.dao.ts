
import { Cronograma, cronogramaProps } from "../model/Cronograma";
import { prisma } from "../utils/prisma";

export class CronogramaDao {
  public async save(cronograma: Cronograma) {
    const { id, nome, descricao, horario, local, tipo, conduzidoPor } = cronograma.props;
    await prisma.cronograma.create({
      data: { id, nome, descricao, horario, local, tipo, conduzidoPor },
    });
  }

  public async getAll(): Promise<cronogramaProps[]> {
    const rows = await prisma.cronograma.findMany({ orderBy: { horario: "asc" } });
    return rows.map(row => ({
      ...row,
      tipo: row.tipo as "Palestra" | "Minicurso" | "Outro",
    }));
  }

  public async getById(id: string): Promise<cronogramaProps | null> {
    const row = await prisma.cronograma.findUnique({ where: { id } });
    if (!row) return null;
    return {
      ...row,
      tipo: row.tipo as "Palestra" | "Minicurso" | "Outro",
    };
  }

  public async delete(id: string) {
    await prisma.cronograma.delete({ where: { id } });
  }

  public async update(id: string, dados: Partial<cronogramaProps>) {
    await prisma.cronograma.update({
      where: { id },
      data: dados,
    });
  }

  public async getByDia(data: string): Promise<cronogramaProps[]> {
    const inicio = new Date(data + "T00:00:00.000Z");
    const fim = new Date(data + "T23:59:59.999Z");

    const rows = await prisma.cronograma.findMany({
      where: {
        horario: {
          gte: inicio,
          lte: fim,
        },
      },
      orderBy: { horario: "asc" },
    });
    return rows.map(row => ({
      ...row,
      tipo: row.tipo as "Palestra" | "Minicurso" | "Outro",
    }));
  }

  public async count(): Promise<number> {
    try {
      return await prisma.cronograma.count()
    } catch (error) {
      throw error
    }
  }
}
