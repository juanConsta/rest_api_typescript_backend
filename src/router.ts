import { Router } from 'express'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'

const router = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *        Product:
 *            type: object
 *            properties:
 *                id:
 *                    type: integer
 *                    description:  The product ID
 *                    example: 1
 *                name: 
 *                    type: string
 *                    description: The product name
 *                    example: Monitor Curvo de 49"
 *                price: 
 *                    type: number
 *                    description: The product price
 *                    example: 300
 *                availability: 
 *                    type: boolean
 *                    description: The product availability
 *                    example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 * 
 * 
 */
router.get('/', getProducts)

/**
* @swagger
* /api/products/{id}:
*  get:
*      summary: Get a Product by ID
*      tags:
*          - Products
*      description: Return a product base on its unique ID
*      parameters:
*        - in: path
*          name: id
*          description: The Id of the product to retrieve
*          required: true
*          schema:
*              type: integer
*      responses:   
*           200:
*               description: Successful response
*               content: 
*                   application/json:
*                       schema: 
*                           $ref: '#/components/schemas/Product'
*           404:
*               description: Not found
* 
*           400:
*               description: Bad Request - Invalid ID
* 
*/
router.get('/:id',
    param('id').isInt().withMessage('Id no valido'),
    handleInputErrors,
    getProductById
)


/**
 * @swagger
 * /api/products/:
 *  post:
 *      summary: Creates a new Product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content: 
 *              application-json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name: 
 *                              type: string
 *                              example: "Monitor Curvo 49 Pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Successful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid Input Data
 *                      
 */
router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede ir vacio'),

    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom((value) => value > 0).withMessage('Precio no valido'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a Product with user Input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The Id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content: 
 *              application-json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name: 
 *                              type: string
 *                              example: "Monitor Curvo 49 Pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid Input Data
 *          404:
 *              description: Product not Found
 * 
 */
router.put('/:id',
    param('id').isInt().withMessage('ID no valido'),

    body('name')
        .notEmpty().withMessage('El nombre del producto no puede ir vacio'),

    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom((value) => value > 0).withMessage('Precio no valido'),

    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no valido'),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Products Availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The Id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not Found
 *          
 * 
 */
router.patch('/:id',
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a Product by given ID
 *      tags: 
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The Id of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successfuly Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto Eliminado'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not Found      
 */
router.delete('/:id',
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors,
    deleteProduct

)

export default router