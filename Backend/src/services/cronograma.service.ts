import { CronogramaDao } from "../dao/cronograma.dao";
import { CreateCronogramaDTO } from "../dto/cronograma.dto";
import { Cronograma, cronogramaProps } from "../model/Cronograma";

export class CronogramaService {
    constructor(private readonly dao: CronogramaDao) {}

    public async create(dto: CreateCronogramaDTO): Promise<Cronograma> {
        const cronograma = Cronograma.build(
            dto.nome,
            dto.descricao,
            new Date(dto.horario),
            dto.local,
            dto.tipo,
            dto.conduzidoPor
        );
        await this.dao.save(cronograma);
        return cronograma;
    }

    public async getAll(): Promise<Cronograma[]> {
        const cronogramas = await this.dao.getAll();
        return cronogramas.map((cronograma) => Cronograma.assemble(cronograma));
    }

    public async getById(id: string): Promise<Cronograma | null> {
        const cronograma = await this.dao.getById(id);
        if (!cronograma) return null;
        return Cronograma.assemble(cronograma);
    }

    public async delete(id: string): Promise<void> {
        await this.dao.delete(id);
    }

    public async update(id: string, dto: Partial<CreateCronogramaDTO>): Promise<void> {
        const dadosAtualizados: Partial<cronogramaProps> = {
            ...dto,
            horario: dto.horario ? new Date(dto.horario) : undefined,
        }
    
        await this.dao.update(id, dadosAtualizados)
    }
    
    

    // Novo método para buscar cronogramas por dia
    public async getByDia(data: string): Promise<Cronograma[]> {
        const cronogramas = await this.dao.getByDia(data);
        return cronogramas.map((cronograma) => Cronograma.assemble(cronograma));
    }
}
