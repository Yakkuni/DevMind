export type palestrateProps = {
    id:string,
    nome: string,
    descricao: string
    foto: string,
    redes: {
        instagram:string,
        linkedin:string,
        youtube:string,
        site:string
    }
}

export class Palestrante{

    private constructor(readonly props: palestrateProps){}

    public static build(nome: string, descricao:string, foto: string, redes:{instagram:string, linkedin:string, youtube:string, site: string} ){

        const props:palestrateProps = {
            id:crypto.randomUUID().toString(),
            nome:nome,
            descricao:descricao,
            foto:foto,
            redes:redes
        }

        return new Palestrante(props)
    }
    
    public static assemble(props:palestrateProps){
        return new Palestrante(props)
    }

    public toJSON(){
        return {
            id: this.props.id,
            nome: this.props.nome,
            descricao: this.props.descricao,
            foto: this.props.foto,
            redes: this.props.redes
        }
    }
}
