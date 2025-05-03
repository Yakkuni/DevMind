import { RowDataPacket } from "mysql2"
import { Palestrante, palestrateProps } from "../model/Palestrante"
import poolCon from "../utils/connection"

export class PalestranteDao {

    public async savePalestrante(palestrante: Palestrante) {
        try {
            const { props } = palestrante
            const { id, descricao, nome, foto, redes } = props
            await poolCon.query(
                'INSERT INTO palestrantes(id, minibio, nome, foto, instagram, linkedin, youtube, site) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [id, descricao, nome, foto, redes.instagram, redes.linkedin, redes.youtube, redes.site]
            )
        } catch (error) {
            throw error
        }
    }

    public async getAllPalestrantes(): Promise<Palestrante[]> {
        const [rows] = await poolCon.query('SELECT * FROM palestrantes') as RowDataPacket[]
        return rows.map((row: any) =>
            Palestrante.assemble({
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
            })
        )
    }

    public async getPalestranteById(id: string): Promise<Palestrante | null> {
        const [rows] = await poolCon.query('SELECT * FROM palestrantes WHERE id = ?', [id]) as RowDataPacket[]
        const row = rows[0]
        if (!row) return null

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
        })
    }

    public async deletePalestranteById(id: string): Promise<boolean> {
        const [result]: any = await poolCon.query('DELETE FROM palestrantes WHERE id = ?', [id])
        return result.affectedRows > 0
    }

    public async updatePalestrante(palestrante: Palestrante): Promise<boolean> {
        const { props } = palestrante
        const { id, descricao, nome, foto, redes } = props
        const [result]: any = await poolCon.query(
            'UPDATE palestrantes SET nome = ?, minibio = ?, foto = ?, instagram = ?, linkedin = ?, youtube = ?, site = ? WHERE id = ?',
            [nome, descricao, foto, redes.instagram, redes.linkedin, redes.youtube, redes.site, id]
        )
        return result.affectedRows > 0
    }
}
