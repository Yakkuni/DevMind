// api/auth.api.ts
import { Api } from "./api";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UsuarioDao } from "../dao/usuario.dao";
import { autenticarRequisicao, autenticarAdmin } from "../utils/auth.middleware";

export class AuthApi {
  private constructor(private readonly api: Api) {}

  public static build(api: Api) {
    const dao = new UsuarioDao();
    const service = new AuthService(dao);
    const controller = new AuthController(service);

    // Rota de login não necessita de autenticação
    api.addRota("/login", "POST", [], controller.login.bind(controller));

    // Rota de registro precisa de autenticação, pois estamos criando usuários
    api.addRota("/register", "POST", [autenticarRequisicao, autenticarAdmin], controller.register.bind(controller)); // Rota de registro;



    // checar se o usuário está autenticado
    api.addRota("/auth/me", "GET", [autenticarRequisicao], controller.me.bind(controller));
    api.addRota("/auth/admin", "GET", [autenticarRequisicao, autenticarAdmin], controller.me.bind(controller));

    
  }
}
