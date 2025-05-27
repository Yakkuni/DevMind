import { Usuario } from "../model/Usuario";
import { UpdateUserDto } from "../dto/user.dto";
import { UsuarioDao } from "../dao/usuario.dao";
import { HistoricoService } from "./historico.service";
import { HistoricoSaver } from "../utils/historico.saver";

export class UserService {
    constructor(private readonly dao: UsuarioDao) {}
    
    public async updateUser(id: string, dto: UpdateUserDto, user:string): Promise<Usuario> {
        const usuario = await this.dao.findById(id);
        if (!usuario) throw new Error("Usuário não encontrado");

        if (dto.name) usuario.setNome(dto.name);
        if (dto.email) usuario.setEmail(dto.email);
        if (dto.password) usuario.setSenha(dto.password);

        await this.dao.update(usuario);
        await HistoricoSaver.createHistorico("atualizou as informações do(a)", `usuário(a) \"${usuario.getNome()}\"`, user);
        return usuario;
    }

    public async deleteUser(id: string, user: string): Promise<void> {
        const usuario = await this.dao.findById(id);
        if (!usuario) throw new Error("Usuário não encontrado");

        await this.dao.delete(id);
        await HistoricoSaver.createHistorico("deletou o(a)", `usuário(a) \"${usuario.getNome()}\"`, user);
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
    try{
      return await this.dao.count();
    }catch(error){
      throw error
    }
  }

  
  public async countUsersByCargo(cargo: 'admin' | 'common'): Promise<number> {
    try{
      return await this.dao.countByCargo(cargo);
    }catch(error){
      throw error
    }
    
  }

}