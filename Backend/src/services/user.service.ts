import { Usuario } from "../model/Usuario";
import { UpdateUserDto } from "../dto/user.dto";
import { UsuarioDao } from "../dao/usuario.dao";

export class UserService {
    constructor(private readonly dao: UsuarioDao) {}
    
    public async updateUser(id: string, dto: UpdateUserDto): Promise<Usuario> {
        const usuario = await this.dao.findById(id);
        if (!usuario) throw new Error("Usuário não encontrado");

        if (dto.name) usuario.setNome(dto.name);
        if (dto.email) usuario.setEmail(dto.email);
        if (dto.password) usuario.setSenha(dto.password);

        await this.dao.update(usuario);
        return usuario;
    }

    public async deleteUser(id: string): Promise<void> {
        const usuario = await this.dao.findById(id);
        if (!usuario) throw new Error("Usuário não encontrado");

        await this.dao.delete(id);
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


}