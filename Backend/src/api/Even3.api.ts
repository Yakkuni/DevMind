import { Api } from "./api";
import { Even3Controller } from "../controllers/Even3.Controller";
import { Even3Service } from "../services/Even3.service";

export class Even3Api {
    private readonly controller: Even3Controller;

    private constructor(private readonly api: Api) {
        // Injeção de dependências: Api -> Controller -> Service
        const service = new Even3Service();
        this.controller = new Even3Controller(service);
    }

    /**
     * Método estático para construir e inicializar as rotas.
     * @param api Instância principal da API.
     */
    public static build(api: Api): void {
        const instance = new Even3Api(api);
        instance.addRotas();
    }

    /**
     * Adiciona as rotas de eventos à instância da API.
     */
    private addRotas(): void {
        // Rota pública para buscar os eventos da Even3
        // Método: GET, Caminho: /eventos, Middlewares: Nenhum, Handler: getEven3Events
        this.api.addRota(
            "/eventos", 
            "GET", 
            [], // Nenhum middleware de autenticação, pois a rota é pública
            this.controller.getEven3Events.bind(this.controller)
        );
    }
}