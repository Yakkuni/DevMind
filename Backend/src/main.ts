import 'reflect-metadata'
import { Api } from './api/api'
import { PalestranteApi } from './api/palestrante.api'
import { CronogramaApi } from './api/cronograma.api'
import { AuthApi } from './api/auth.api'
import { UserApi } from './api/user.api'
import { seedAdmin } from './utils/seedAdmin'

async function main() {
    const api = Api.build()

    PalestranteApi.build(api)
    CronogramaApi.build(api)
    AuthApi.build(api)
    UserApi.build(api)

    await seedAdmin();
    
    api.start()
}

main()
