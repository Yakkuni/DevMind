import { Palestrante } from "../model/Palestrante";
import { CreatePalestranteDTO } from "../dto/palestrante.dto";
import { PalestranteDao } from "../dao/palestrante.dao";

export class PalestranteService {
    constructor(private readonly dao: PalestranteDao) {}

    public async criar(dto: CreatePalestranteDTO): Promise<Palestrante> {
        const redes = this.montarRedes(dto);


        const palestrante = Palestrante.build(
            dto.nome, 
            dto.descricao, 
            dto.foto, 
            redes);
        await this.dao.save(palestrante);
        return palestrante;
    }
    

    public async listarTodos(): Promise<Palestrante[]> {
        return this.dao.findAll();
    }

    public async buscarPorId(id: string): Promise<Palestrante | null> {
        return this.dao.findById(id);
    }

    public async remover(id: string): Promise<void> {
        await this.dao.deleteById(id);
    }

    public async atualizar(id: string, dto: CreatePalestranteDTO): Promise<Palestrante | null> {
        const existente = await this.dao.findById(id);
        if (!existente) return null;
    
        const atualizado = Palestrante.assemble({
            id,
            nome: dto.nome,
            descricao: dto.descricao,
            foto: dto.foto,
            redes: this.montarRedes(dto)
        });
    
        await this.dao.update(atualizado);
        return atualizado;
    }
    

    public async listarPreviews(): Promise<{ id: string, nome: string, descricao: string, foto: string }[]> {
        const todos = await this.dao.findAll();
        return todos.map(p => {
            const { id, nome, descricao, foto } = p.toJSON();
            return { id, nome, descricao, foto };
        });
    }

    private montarRedes(dto: CreatePalestranteDTO) {
        return {
            instagram: dto.instagram ?? null,
            linkedin: dto.linkedin ?? null,
            youtube: dto.youtube ?? null,
            site: dto.site ?? null
        };
    }

    public async criarEmLote(dtos: CreatePalestranteDTO[]): Promise<void> {
        for (const dto of dtos) {
            const palestrante = Palestrante.build(dto.nome, dto.descricao, dto.foto, {
                instagram: dto.instagram || null,
                linkedin: dto.linkedin || null,
                youtube: dto.youtube || null,
                site: dto.site || null,
            });
    
            await this.dao.save(palestrante);
        }
    }
    
    
    
    
}
