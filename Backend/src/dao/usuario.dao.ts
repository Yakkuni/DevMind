import { PrismaClient } from "@prisma/client";
import { Usuario } from "../model/Usuario";

const prisma = new PrismaClient();

export class UsuarioDao {
  public async create(usuario: Usuario): Promise<void> {
    const { id, nome, email, cargo} = usuario.toJSON();

    await prisma.usuario.create({
      data: {
        id,
        nome,
        email,
        cargo,
        senha: usuario.getSenha(),
      },
    });
  }

  public async findByEmail(email: string): Promise<Usuario | null> {
    const row = await prisma.usuario.findUnique({ where: { email } });
    if (!row) return null;

    return Usuario.assemble({
      id: row.id,
      nome: row.nome,
      email: row.email,
      cargo: row.cargo as 'admin' | 'comum',
      senha: row.senha,
    });
  }

  public async findAll(): Promise<Usuario[]> {
    const rows = await prisma.usuario.findMany();
    return rows.map((row) =>
      Usuario.assemble({
        id: row.id,
        nome: row.nome,
        email: row.email,
        cargo: row.cargo as 'admin' | 'comum',
        senha: row.senha,
      })
    );

  }
  public async findById(id: string): Promise<Usuario | null> {
    const row = await prisma.usuario.findUnique({ where: { id } });
    if (!row) return null;

    return Usuario.assemble({
      id: row.id,
      nome: row.nome,
      email: row.email,
      cargo: row.cargo as 'admin' | 'comum',
      senha: row.senha,
    });
  }

  public async update(usuario: Usuario): Promise<void> {
    const { id, nome, email, cargo } = usuario.toJSON();

    await prisma.usuario.update({
      where: { id },
      data: {
        nome,
        email,
        cargo,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.usuario.delete({ where: { id } });
  }


  public async count(): Promise<number> {
    return prisma.usuario.count();
  }

  public async countByCargo(cargo: 'admin' | 'common'): Promise<number> {
    return prisma.usuario.count({
      where: {
        cargo,
      },
    });
  }


}
