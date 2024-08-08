import createApp from './app'
import { ApplicationInfo } from './applicationInfo'
import { services } from './services'

const app = (applicationInfo: ApplicationInfo) => createApp(services, applicationInfo)

export default app
