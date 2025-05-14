import { UsuarioDao } from "../dao/usuario.dao";
import { LoginDTO } from "../dto/auth.dto";
import { Usuario } from "../model/Usuario";
import { gerarToken } from "../utils/token";
import { Cryptography } from "../utils/cryptography";


export class AuthService {
  constructor(private readonly dao: UsuarioDao) {}

  // Função de autenticação (login)
  public async autenticar(dto: LoginDTO): Promise<string> {
    const usuario = await this.dao.findByEmail(dto.email);
    if (!usuario) throw new Error("Credenciais inválidas");

    const senhaCorreta = await Cryptography.compareHash(dto.senha, usuario.getSenha());
    if (!senhaCorreta) throw new Error("Credenciais inválidas");

    return gerarToken({ 
      id: usuario.getId(), 
      email: usuario.getEmail(), 
      cargo: usuario.getCargo(), });
  }

  // Função de registro (cadastro) de um novo usuário
  public async registrar(nome: string, email: string, cargo: 'admin' | 'comum', senha: string): Promise<void> {
    // Verifica se já existe um usuário com esse e-mail
    const usuarioExistente = await this.dao.findByEmail(email);
    if (usuarioExistente) throw new Error("E-mail já cadastrado");

    // Criptografa a senha
    const senhaCriptografada = await Cryptography.hash(senha);

    // Cria o novo usuário
    const usuario = Usuario.build(nome, email, cargo, senhaCriptografada);

    // Salva o usuário no banco de dados
    await this.dao.create(usuario);
  }
}
