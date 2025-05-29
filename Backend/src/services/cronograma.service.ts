import { CronogramaDao } from "../dao/cronograma.dao";
import { CreateCronogramaDTO } from "../dto/cronograma.dto";
import { Cronograma, cronogramaProps } from "../model/Cronograma";
import { HistoricoSaver } from "../utils/historico.saver";
import { HistoricoService } from "./historico.service";

export class CronogramaService {
    constructor(
        private readonly dao: CronogramaDao
    ) {}

    public async create(dto: CreateCronogramaDTO, user: string): Promise<Cronograma> {
        try{
            const cronograma = Cronograma.build(
                dto.nome,
                dto.descricao,
                new Date(dto.horario),
                dto.local,
                dto.tipo,
                dto.conduzidoPor
            );
            
            await this.dao.save(cronograma);
            await HistoricoSaver.createHistorico("criou", `a atividade \"${cronograma.props.nome}\"`, user);
            return cronograma;
    }catch(error){
            console.error("Erro ao criar cronograma:", error);
            throw error;
        }
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

    public async delete(id: string, user: string): Promise<void> {
        const atividade = await this.getById(id);
        await this.dao.delete(id);
        await HistoricoSaver.createHistorico("deletou", `a atividade \"${atividade?.props.nome}\"`, user);
    }

    public async update(id: string, dto: Partial<CreateCronogramaDTO>, user: string): Promise<void> {
        const dadosAtualizados: Partial<cronogramaProps> = {
            ...dto,
            horario: dto.horario ? new Date(dto.horario) : undefined,
        }
        const nomeAntigo = (await this.getById(id))?.props.nome;
        await this.dao.update(id, dadosAtualizados)
        await HistoricoSaver.createHistorico("editou", `a atividade \"${nomeAntigo}\"`, user);
    }
    
    

    public async getByDia(data: string): Promise<Cronograma[]> {
        const cronogramas = await this.dao.getByDia(data);
        return cronogramas.map((cronograma) => Cronograma.assemble(cronograma));
    }

    public async count(): Promise<number> {
        try {
            return await this.dao.count()
        } catch (error) {
            throw error
        }
    }
}
