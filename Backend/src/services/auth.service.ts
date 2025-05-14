// services/auth.service.ts
import bcrypt from "bcrypt";
import { UsuarioDao } from "../dao/usuario.dao";
import { LoginDTO } from "../dto/auth.dto";
import { Usuario } from "../model/Usuario";
import { gerarToken } from "../utils/token";

const SALT_ROUNDS = 10; // O número de "salts" para o bcrypt

export class AuthService {
  constructor(private readonly dao: UsuarioDao) {}

  // Função de autenticação (login)
  public async autenticar(dto: LoginDTO): Promise<string> {
    const usuario = await this.dao.findByEmail(dto.email);
    if (!usuario) throw new Error("Credenciais inválidas");

    const senhaCorreta = await bcrypt.compare(dto.senha, usuario.getSenha());
    if (!senhaCorreta) throw new Error("Credenciais inválidas");

    return gerarToken({ id: usuario.getId(), email: usuario.getEmail() });
  }

  // Função de registro (cadastro) de um novo usuário
  public async registrar(nome: string, email: string, senha: string): Promise<void> {
    // Verifica se já existe um usuário com esse e-mail
    const usuarioExistente = await this.dao.findByEmail(email);
    if (usuarioExistente) throw new Error("E-mail já cadastrado");

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, SALT_ROUNDS);

    // Cria o novo usuário
    const usuario = Usuario.build(nome, email, senhaCriptografada);

    // Salva o usuário no banco de dados
    await this.dao.create(usuario);
  }
}
