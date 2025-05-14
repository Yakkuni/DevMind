import 'reflect-metadata'
import { Api } from './api/api'
import { PalestranteApi } from './api/palestrante.api'
import { CronogramaApi } from './api/cronograma.api'
import { AuthApi } from './api/auth.api'

function main() {
    const api = Api.build()

    PalestranteApi.build(api)
    CronogramaApi.build(api)
    AuthApi.build(api)

    api.start()
}

main()
