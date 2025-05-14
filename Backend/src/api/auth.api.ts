// api/auth.api.ts
import { Api } from "./api";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UsuarioDao } from "../dao/usuario.dao";
import { autenticarRequisicao } from "../utils/auth.middleware"; // Importando o middleware

export class AuthApi {
  private constructor(private readonly api: Api) {}

  public static build(api: Api) {
    const dao = new UsuarioDao();
    const service = new AuthService(dao);
    const controller = new AuthController(service);

    // Rota de login não necessita de autenticação
    api.addRota("/login", "POST", [], controller.login.bind(controller));

    // Rota de registro precisa de autenticação, pois estamos criando usuários
    api.addRota("/register", "POST", [], controller.register.bind(controller)); // Rota de registro; LEMBRAR DE ADICIONAR O "autenticarRequisicao" DEPOIS PELO AMOR DE DEUS



    // checar se o usuário está autenticado
    api.addRota("/auth/me", "GET", [autenticarRequisicao], controller.me.bind(controller));

  }
}
