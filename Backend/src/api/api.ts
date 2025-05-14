import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

// Converte a PORT do .env para número e valida
const PORT = parseInt(process.env.PORT || "", 10);
if (isNaN(PORT)) {
  throw new Error("PORT inválida. Verifique o arquivo .env e use um número, como PORT=3000");
}

export class Api {
  private constructor(readonly app: Express) {}

  public static build() {
    const app = express();
    app.use(express.json());
    return new Api(app);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
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
