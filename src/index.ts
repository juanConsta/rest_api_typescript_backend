import server from "./server";
import colors from 'colors'

const port = process.env.port || 4000
server.listen(port, () => {
    console.log(colors.cyan.bold(`REST API en el puerto http://localhost:${port}`))
})