import poolCon from "../utils/connection";
import { Palestrante } from "../model/Palestrante";
import { RowDataPacket } from "mysql2";

export class PalestranteDao {
    public async save(palestrante: Palestrante) {
        const { id, nome, descricao, foto, redes } = palestrante.toJSON();
        await poolCon.query(
            'INSERT INTO palestrantes(id, nome, minibio, foto, instagram, linkedin, youtube, site) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, nome, descricao, foto, redes.instagram, redes.linkedin, redes.youtube, redes.site]
        );
    }

    public async findAll(): Promise<Palestrante[]> {
        const [rows] = await poolCon.query<RowDataPacket[]>('SELECT * FROM palestrantes');
        return rows.map(row => Palestrante.assemble({
            id: row.id,
            nome: row.nome,
            descricao: row.minibio,
            foto: row.foto,
            redes: {
                instagram: row.instagram,
                linkedin: row.linkedin,
                youtube: row.youtube,
                site: row.site
            }
        }));
    }

    public async findById(id: string): Promise<Palestrante | null> {
        const [rows] = await poolCon.query<RowDataPacket[]>('SELECT * FROM palestrantes WHERE id = ?', [id]);
        const row = rows[0];
        if (!row) return null;

        return Palestrante.assemble({
            id: row.id,
            nome: row.nome,
            descricao: row.minibio,
            foto: row.foto,
            redes: {
                instagram: row.instagram,
                linkedin: row.linkedin,
                youtube: row.youtube,
                site: row.site
            }
        });
    }

    public async deleteById(id: string): Promise<void> {
        await poolCon.query('DELETE FROM palestrantes WHERE id = ?', [id]);
    }

    public async update(palestrante: Palestrante): Promise<void> {
        const { id, nome, descricao, foto, redes } = palestrante.toJSON();
        await poolCon.query(
            'UPDATE palestrantes SET nome = ?, minibio = ?, foto = ?, instagram = ?, linkedin = ?, youtube = ?, site = ? WHERE id = ?',
            [nome, descricao, foto, redes.instagram, redes.linkedin, redes.youtube, redes.site, id]
        );
    }
}
