type usuarioProps = {
  id: string,
  nome: string,
  email: string,
  senha: string; // hash da senha
};

export class Usuario {
  constructor(private readonly props: usuarioProps) {}

  public static build(nome: string, email: string, senha: string) {
    return new Usuario({
      id: crypto.randomUUID(),
      nome,
      email,
      senha
    });
  }

  public static assemble(props: usuarioProps) {
    return new Usuario(props);
  }

  public toJSON() {
    const { senha, ...rest } = this.props;
    return rest;
  }

  public getSenha() {
    return this.props.senha;
  }

  public getEmail() {
    return this.props.email;
  }

  public getId() {
    return this.props.id;
  }
}
