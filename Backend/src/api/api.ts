// api.ts
import express, { Express, Request, Response } from "express"

const PORT = 3000;

export class Api {
    private constructor(readonly app: Express) {}

    public static build() {
        const app = express()
        app.use(express.json())
        return new Api(app)
    }

    public start() {
        this.app.listen(PORT, () => {
            console.log("Server is running on http://localhost:" + PORT)
        })
    }

    public addRota(rota: string, metodo: string, middlewares: any[], funcao: (request: Request, response: Response) => void): void {
        if (metodo === "POST") {
            this.app.post(rota, ...middlewares, funcao)
        } else if (metodo === "GET") {
            this.app.get(rota, ...middlewares, funcao)
        } else if (metodo === "DELETE") {
            this.app.delete(rota, ...middlewares, funcao)
        } else if (metodo === "PUT") {
            this.app.put(rota, ...middlewares, funcao)
        } else if (metodo === "PATCH") {
            this.app.patch(rota, ...middlewares, funcao)
        }
    }
}
