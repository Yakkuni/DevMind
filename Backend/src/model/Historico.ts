type historicoProps = {
  id: string;
  acao: string;
  entidade: string;
  usuarioId: string;
  data: Date;
};

export class Historico {
  private constructor(readonly props: historicoProps) {}

  public static build(acao: string, entidade: string, usuarioId: string) {
    const props: historicoProps = {
      id: crypto.randomUUID(),
      acao,
      entidade,
      usuarioId,
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
