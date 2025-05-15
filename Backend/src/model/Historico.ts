type historicoProps = {
  id: string;
  acao: string;
  entidade: string;
  usuario: string;
  data: Date;
};

export class Historico {
  private constructor(readonly props: historicoProps) {}

  public static build(acao: string, entidade: string, usuario: string) {
    const props: historicoProps = {
      id: crypto.randomUUID(),
      acao,
      entidade,
      usuario,
      data: new Date(),
    };
    return new Historico(props);
  }

  public static assemble(props: historicoProps) {
    return new Historico(props);
  }

  public toJSON() {
    return this.props;
  }
}
