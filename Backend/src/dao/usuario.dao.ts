// dao/usuario.dao.ts
import { Usuario } from "../model/Usuario";
import poolCon from "../utils/connection";
import { RowDataPacket } from "mysql2";

export class UsuarioDao {
  // Função para criar um novo usuário no banco de dados
  public async create(usuario: Usuario): Promise<void> {
    const { id, nome, email } = usuario.toJSON();

    const query = `
      INSERT INTO usuarios (id, nome, email, senha)
      VALUES (?, ?, ?, ?)
    `;

    // Executa a query de inserção
    await poolCon.query(query, [id, nome, email, usuario.getSenha()]);
  }

  // Função para encontrar usuário pelo e-mail
  public async findByEmail(email: string): Promise<Usuario | null> {
    const [rows] = await poolCon.query<RowDataPacket[]>(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    const row = rows[0];
    if (!row) return null;

    return Usuario.assemble({
      id: row.id,
      nome: row.nome,
      email: row.email,
      senha: row.senha,
    });
  }
}
