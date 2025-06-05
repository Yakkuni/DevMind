import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // Importa o middleware CORS
import path from "path";

dotenv.config();

// Converte a PORT do .env para número e valida
const PORT_STRING = process.env.PORT || "3000"; // Define um fallback caso process.env.PORT seja undefined
const PORT = parseInt(PORT_STRING, 10);

if (isNaN(PORT)) {
  // Se, mesmo após o fallback, não for um número, lança erro.
  // Isso é improvável com o fallback "3000", mas mantém a robustez.
  throw new Error(`PORT inválida: "${PORT_STRING}". Verifique o arquivo .env e use um número, como PORT=3000`);
}

export class Api {
  private constructor(readonly app: Express) {}

  public static build() {
    const app = express();

    // Configuração do CORS para permitir múltiplas origens, incluindo seu frontend Vue
    const allowedOrigins = [
      "http://localhost:5500",   // Sua origem existente
      "http://127.0.0.1:5500",   // Sua origem existente
      "http://localhost:5173"    // ✅ ADICIONADO: A origem do seu frontend Vue.js
    ];

    app.use(
      cors({
        origin: function (origin, callback) {
          // Permite requisições sem 'origin' (como Postman, apps mobile, ou server-to-server)
          // OU se a origem estiver na lista de permitidas
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true // Se você precisar enviar cookies ou cabeçalhos de autorização
      })
    );

    app.use(express.json()); // Middleware para ler JSON

    app.use("/uploads", express.static(path.resolve(__dirname, "../../uploads")));

    return new Api(app);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`Servidor backend rodando em http://localhost:${PORT}`);
      console.log(
        `Origens CORS permitidas (se definidas): ${JSON.stringify(
          this.app.get("corsOptions")?.origin || "Verifique a configuração app.use(cors(...))"
        )}`
      );
    });
  }

  public addRota(
    rota: string,
    metodo: string,
    middlewares: any[],
    funcao: (request: Request, response: Response) => void
  ): void {
    switch (metodo.toUpperCase()) {
      case "POST":
        this.app.post(rota, ...middlewares, funcao);
        break;
      case "GET":
        this.app.get(rota, ...middlewares, funcao);
        break;
      case "DELETE":
        this.app.delete(rota, ...middlewares, funcao);
        break;
      case "PUT":
        this.app.put(rota, ...middlewares, funcao);
        break;
      case "PATCH":
        this.app.patch(rota, ...middlewares, funcao);
        break;
      default:
        throw new Error(`Método HTTP não suportado: ${metodo}`);
    }
  }
}
