type patrocinadorProps = {
    id: string;
    nome: string;
    logo: string;
    redeSocial: object[];
    
}

export class Patrocinador {
    private constructor(readonly props: patrocinadorProps) {}
  
    public static build(nome: string, logo: string, redeSocial: object[]) {
        const props: patrocinadorProps = {
            id: crypto.randomUUID(),
            nome,
            logo,
            redeSocial
        };
        return new Patrocinador(props);
    }
  
    public static assemble(props: patrocinadorProps) {
        return new Patrocinador(props);
    }
  
    public toJSON() {
        return this.props;
    }
}