type palestranteProps = {
    id: string;
    nome: string;
    descricao: string;
    foto: string;
    redes: {
      instagram: string | null;
      linkedin: string | null;
      youtube: string | null;
      site: string | null;
    };
  };  

export class Palestrante {
    private constructor(private readonly props: palestranteProps) {}

    public static build(nome: string, descricao: string, foto: string, redes: palestranteProps["redes"]) {
        const props: palestranteProps = {
            id: crypto.randomUUID(),
            nome,
            descricao,
            foto,
            redes
        };
        return new Palestrante(props);
    }

    public static assemble(props: palestranteProps) {
        return new Palestrante(props);
    }

    public toJSON() {
        return this.props;
    }

    public getId() {
        return this.props.id;
    }

    public getNome() {
        return this.props.nome;
    } 
    public getDescricao() {
        return this.props.descricao;
    }

    public getFoto() {
        return this.props.foto;
    }
    public getRedes() {
        return this.props.redes;
    }
}
