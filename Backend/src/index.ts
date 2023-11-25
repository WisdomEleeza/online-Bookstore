import 'dotenv/config'
import 'module-alias/register'
import App from './app'


const app = new App(
    Number(process.env.PORT)
)

app.listen()