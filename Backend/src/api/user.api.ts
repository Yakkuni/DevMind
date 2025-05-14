import { Api } from "./api";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UsuarioDao } from "../dao/usuario.dao";
import { autenticarRequisicao, autenticarAdmin } from "../utils/auth.middleware"; // Importando o middleware
export class UserApi {
  private constructor(private readonly api: Api) {}

  public static build(api: Api) {
    const dao = new UsuarioDao();
    const service = new UserService(dao);
    const controller = new UserController(service);


    api.addRota("/user", "GET", [autenticarRequisicao, autenticarAdmin], controller.getAllUsers.bind(controller)); 
    api.addRota("/user/:id", "GET", [autenticarRequisicao, autenticarAdmin], controller.getUserById.bind(controller));
    api.addRota("/user/:id", "PUT", [autenticarRequisicao, autenticarAdmin], controller.updateUser.bind(controller));
    api.addRota("/user/:id", "DELETE", [autenticarRequisicao, autenticarAdmin], controller.deleteUser.bind(controller));
    }
}