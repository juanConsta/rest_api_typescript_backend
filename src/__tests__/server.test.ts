import server, { connectDB } from '../server'
import db from '../config/db'

jest.mock('../config/db')
describe('Connect DB', () => {
    it('Should handle a database connection error', async () => {

        jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Hubo un error al conectar la base de datos'))
        const consoleSpy = jest.spyOn(console, 'log')
        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Hubo un error al conectar la base de datos')
        )

    })
})