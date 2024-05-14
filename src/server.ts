import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import swaggerUI from "swagger-ui-express"
import swaggerSpec from "./config/swagger";
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'

//Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
    } catch (error) {
        console.log(colors.red.bold('Hubo un error al conectar la base de datos'))
    }
}

connectDB()

//Instancia de express
const server = express()

//Permitir conexiones
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

server.use(morgan('dev'))


//Leer datos de formularios
server.use(express.json())

server.use('/api/products', router)


//Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
export default server