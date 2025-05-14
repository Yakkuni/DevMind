type usuarioProps = {
  id: string,
  nome: string,
  email: string,
  cargo: 'admin' | 'comum',
  senha: string;
};

export class Usuario {
  constructor(private readonly props: usuarioProps) {}

  public static build(nome: string, email: string, cargo: 'admin' | 'comum', senha: string) {
    return new Usuario({
      id: crypto.randomUUID(),
      nome,
      email,
      cargo,
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

  public getNome() {
    return this.props.nome;
  }
  public getCargo() {
    return this.props.cargo;
  }

  public getId() {
    return this.props.id;
  }

  public setNome(nome: string) {
    this.props.nome = nome;
  }
  public setEmail(email: string) {
    this.props.email = email;
  }
  public setSenha(senha: string) {
    this.props.senha = senha;
  }
  public setCargo(cargo: 'admin' | 'comum') {
    this.props.cargo = cargo;
  }
}
