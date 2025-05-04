import poolCon from "../utils/connection";
import { Cronograma, cronogramaProps } from "../model/Cronograma";

export class CronogramaDao {
    public async save(cronograma: Cronograma) {
        const { id, nome, descricao, horario, local, tipo, conduzidoPor } = cronograma.props;
        await poolCon.query(
            `INSERT INTO cronograma (id, nome, descricao, horario, local, tipo, conduzidoPor) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, nome, descricao, horario, local, tipo, conduzidoPor]
        );
    }

    public async getAll(): Promise<cronogramaProps[]> {
        const [rows] = await poolCon.query('SELECT * FROM cronograma ORDER BY horario ASC');
        return (rows as any[]).map(row => ({
            id: row.id,
            nome: row.nome,
            descricao: row.descricao,
            horario: new Date(row.horario),
            local: row.local,
            tipo: row.tipo,
            conduzidoPor: row.conduzidoPor
        }));
    }

    public async getById(id: string): Promise<cronogramaProps | null> {
        const [rows] = await poolCon.query('SELECT * FROM cronograma WHERE id = ?', [id]);
        const row = (rows as any[])[0];
        if (!row) return null;
        return {
            id: row.id,
            nome: row.nome,
            descricao: row.descricao,
            horario: new Date(row.horario),
            local: row.local,
            tipo: row.tipo,
            conduzidoPor: row.conduzidoPor
        };
    }

    public async delete(id: string) {
        await poolCon.query('DELETE FROM cronograma WHERE id = ?', [id]);
    }

    public async update(id: string, dados: Partial<cronogramaProps>) {
        const campos = [];
        const valores = [];

        for (const key in dados) {
            campos.push(`${key} = ?`);
            valores.push((dados as any)[key]);
        }

        const sql = `UPDATE cronograma SET ${campos.join(', ')} WHERE id = ?`;
        await poolCon.query(sql, [...valores, id]);
    }

    // Novo método para buscar cronogramas por data (dia)
    public async getByDia(data: string): Promise<cronogramaProps[]> {
        const dataFormatada = new Date(data).toISOString().split('T')[0]; // Formata a data para 'YYYY-MM-DD'
        const [rows] = await poolCon.query(
            'SELECT * FROM cronograma WHERE DATE(horario) = ? ORDER BY horario ASC',
            [dataFormatada]
        );
        return (rows as any[]).map(row => ({
            id: row.id,
            nome: row.nome,
            descricao: row.descricao,
            horario: new Date(row.horario),
            local: row.local,
            tipo: row.tipo,
            conduzidoPor: row.conduzidoPor
        }));
    }
}
