import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {

    it('Should display validation errors', async () => {
        const res = await request(server).post('/api/products').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it('Should validate that the price is greater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: 'Xbox',
            price: 0
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it('Should validate that the price is a number and greater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: 'Xbox',
            price: 'Hola'
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(4)
    })



    it('Should create a new product', async () => {
        const res = await request(server).post('/api/products').send({
            name: 'Mouse - test',
            price: 300
        })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('errors')
    })

})

describe('GET /api/productos', () => {

    it('Should check if /api/products url exists', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).not.toBe(404)
    })

    it('GET a JSON response whit the products', async () => {
        const res = await request(server).get('/api/products')

        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveLength(1)

        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productID = 2000
        const res = await request(server).get(`/api/products/${productID}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')
    })

    it('Should check a valid id in the url', async () => {
        const res = await request(server).get('/api/products/not-valid')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Id no valido')
    })

    it('GET a JSON response for a single product', async () => {
        const res = await request(server).get('/api/products/1')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    it('Should check a valid id in the url', async () => {
        const res = await request(server).put('/api/products/not-valid').send({
            name: 'Monitor Curvo Test',
            price: 100,
            availability: true
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('ID no valido')
    })

    it('Should display validation error messages when updating a product', async () => {
        const res = await request(server).put('/api/products/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(5)

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should validate that the price is greater than 0', async () => {
        const res = await request(server).put('/api/products/1').send({
            name: 'Monitor Curvo Test',
            price: 0,
            availability: true
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('Precio no valido')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productID = 4000
        const res = await request(server).put(`/api/products/${productID}`).send({
            name: 'Monitor Curvo Test',
            price: 100,
            availability: true
        })

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('Should update an existing product whit validate', async () => {
        const res = await request(server).put(`/api/products/1`).send({
            name: 'Monitor Curvo Test',
            price: 100,
            availability: true
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('errors')
    })

})

describe('PATCH /api/products/:id', () => {
    it('Should return a 404 response for non-existent product', async () => {
        const productID = 2000
        const res = await request(server).patch(`/api/products/${productID}`)

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const res = await request(server).patch('/api/products/1')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.availability).toBe(false)

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {

    it('Should check a valid id', async () => {
        const res = await request(server).delete('/api/products/not-valid')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('ID no valido')
    })

    it('Should return a 404 status for a non-existent product', async () => {
        const productID = 2000
        const res = await request(server).delete(`/api/products/${productID}`)

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
    })

    it('Should delete a product', async () => {
        const res = await request(server).delete('/api/products/1')

        expect(res.status).toBe(200)
        expect(res.body.data).toBe('Producto Eliminado')

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(400)
    })
})
