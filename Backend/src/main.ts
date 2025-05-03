import 'reflect-metadata'
import { Api } from './api/api'
import { PalestranteApi } from './api/palestrante.api'
import { CronogramaApi } from './api/cronograma.api'

function main() {
    const api = Api.build()

    PalestranteApi.build(api)
    CronogramaApi.build(api)

    api.start()
}

main()
