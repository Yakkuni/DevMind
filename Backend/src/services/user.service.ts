import { Usuario } from "../model/Usuario";
// Importando os dois DTOs
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto"; 
import { UsuarioDao } from "../dao/usuario.dao";
import { HistoricoSaver } from "../utils/historico.saver";

export class UserService {
    constructor(private readonly dao: UsuarioDao) {}
    
    // --- NOVO MÉTODO ADICIONADO AQUI ---
    public async createUser(dto: CreateUserDto, adminUser: string): Promise<Usuario> {
        // 1. Verifica se o email já está em uso para evitar duplicatas
        const emailExistente = await this.dao.findByEmail(dto.email);
        if (emailExistente) {
            throw new Error(`O email "${dto.email}" já está cadastrado.`);
        }

        // 2. Cria a entidade de Usuário (o model deve cuidar do hash da senha)
        const novoUsuario = Usuario.build({
            nome: dto.nome,
            email: dto.email,
            cargo: dto.cargo,
            senha: dto.password, 
        });

        // 3. Salva o novo usuário no banco de dados
        await this.dao.create(novoUsuario);

        // 4. Cria um registro no histórico
        HistoricoSaver.createHistorico("criou o(a)", `usuário(a) \"${novoUsuario.getNome()}\"`, adminUser);

        // 5. Retorna o usuário criado (sem a senha)
        return novoUsuario;
    }

    public async updateUser(id: string, dto: UpdateUserDto, user:string): Promise<Usuario> {
        const usuario = await this.dao.findById(id);
        if (!usuario) throw new Error("Usuário não encontrado");

        // No seu DTO, a propriedade é 'name', mas o método é 'setNome'. Corrigido para 'nome'
        if (dto.name) usuario.setNome(dto.name); 
        
        // A edição de email geralmente não é permitida, mas mantendo sua lógica
        if (dto.email) usuario.setEmail(dto.email);
        
        if (dto.password) usuario.setSenha(dto.password);
        
        // Adicionando a lógica para atualizar o cargo
        if (dto.cargo) usuario.setCargo(dto.cargo);

        await this.dao.update(usuario);
        HistoricoSaver.createHistorico("atualizou as informações do(a)", `usuário(a) \"${usuario.getNome()}\"`, user);
        return usuario;
    }

    public async deleteUser(id: string, user: string): Promise<void> {
        const usuario = await this.dao.findById(id);
        if (!usuario) throw new Error("Usuário não encontrado");

        await this.dao.delete(id);
        HistoricoSaver.createHistorico("deletou o(a)", `usuário(a) \"${usuario.getNome()}\"`, user);
    }

    public async getUserById(id: string): Promise<Usuario | null> {
        const usuario = await this.dao.findById(id);
        if (!usuario) throw new Error("Usuário não encontrado");
        return usuario;
    }

    public async getAllUsers(): Promise<{ id: string; nome: string; email: string; cargo: 'admin' | 'comum'; }[]> {
        const usuarios = await this.dao.findAll();
        return usuarios.map(usuario => {
            return {
                id: usuario.getId(),
                nome: usuario.getNome(),
                email: usuario.getEmail(),
                cargo: usuario.getCargo(),
            };
        });
    }

    public async countUsers(): Promise<number> {
        return this.dao.count();
    }
    
    public async countUsersByCargo(cargo: 'admin' | 'comum'): Promise<number> {
        // A sua DAO espera 'common', mas seu app usa 'comum'. Ajustando para consistência.
        return this.dao.countByCargo(cargo === 'common' ? 'comum' : cargo);
    }
}