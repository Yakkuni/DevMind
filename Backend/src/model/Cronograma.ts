export type cronogramaProps = {
    id: string,
    nome: string,
    descricao: string,
    horario: Date,
    local: string,
    tipo: string;
    conduzidoPor: string
}

export class Cronograma {
    private constructor(readonly props: cronogramaProps) {}

    public static build(
        nome: string,
        descricao: string,
        horario: Date,
        local: string,
        tipo: string,
        conduzidoPor: string
    ) {
        const props: cronogramaProps = {
            id: crypto.randomUUID().toString(),
            nome,
            descricao,
            horario,
            local,
            tipo,
            conduzidoPor
        }
        return new Cronograma(props)
    }

    public static assemble(props: cronogramaProps) {
        return new Cronograma(props)
    }
}
