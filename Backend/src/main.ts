import 'reflect-metadata'
import {Api} from './api/api'
import { PalestranteApi } from './api/palestrante.api'


function main() {
    const api = Api.build()
    PalestranteApi.build(api)

    api.start()
}

main()