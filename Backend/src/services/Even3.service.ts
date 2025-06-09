import fetch from 'node-fetch';

// Para maior segurança, é recomendado colocar este token em um arquivo .env na raiz do seu PROJETO BACK-END
// e acessá-lo com: process.env.EVEN3_API_TOKEN
const EVEN3_API_TOKEN = process.env.EVEN3_API_TOKEN || '543caf60-335a-4736-aae2-30afb17f5631';
const EVEN3_API_URL = 'https://www.even3.com.br/api/v1/event';

export class Even3Service {
    /**
     * Busca todos os eventos da API da Even3.
     * @returns A resposta JSON da API.
     * @throws Lança um erro se a requisição para a API da Even3 falhar.
     */
    public async fetchAllEvents(): Promise<any> {
        try {
            console.log("SERVIÇO: Buscando eventos na API da Even3...");

            const response = await fetch(EVEN3_API_URL, {
                method: 'GET',
                headers: {
                    'Authorization-Token': EVEN3_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Se a resposta não for bem-sucedida, captura o texto do erro e o lança
                const errorText = await response.text();
                throw new Error(`A API da Even3 retornou um erro: ${response.status} - ${errorText}`);
            }

            // Retorna os dados dos eventos em formato JSON
            return await response.json();

        } catch (error) {
            console.error('Erro no Even3Service ao acessar a API:', (error as Error).message);
            // Propaga o erro para que a camada do controller possa tratá-lo
            throw error;
        }
    }
}