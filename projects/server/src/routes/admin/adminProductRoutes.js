const express = require('express')
const { adminProductController, adminProductImageController } = require('../../controllers')
const { check } = require('express-validator')
const upload = require('../../middleware/uploadMiddleware')
const { adminVerifyToken } = require('../../middleware/adminAuth')
const router = express.Router()

router.get('/', adminProductController.getProducts)
router.get('/inventory', adminVerifyToken, adminProductController.getStoreProducts)
router.get('/:productId', adminProductController.getProductById)
router.post('/add-product', adminVerifyToken,
  upload.array('product_images', 3),
  check('store_id').notEmpty().withMessage('Store id is required'),
  check('product_name').notEmpty().withMessage('Product name is required'),
  check('quantity_in_stock').notEmpty().withMessage('Product quantity is required'),
  adminProductController.addProduct)
router.put('/:productId',
  check('product_category_id').notEmpty().withMessage('Product category is required'),
  check('product_name').notEmpty().withMessage('Product name is required'),
  check('product_description').notEmpty().withMessage('Product description is required'),
  check('product_price').notEmpty().withMessage('Product price is required'),
  adminProductController.updateProduct)
router.delete('/:productId', adminVerifyToken, adminProductController.deleteProduct)
router.delete('/:productId/permanently', adminProductController.hardDeleteProduct)

router.post('/image', adminVerifyToken,
  upload.single('product_image'),
  check('product_id').notEmpty().withMessage('Product id is required'),
  adminProductImageController.addProductImage)
router.put('/image/:productImageId', adminVerifyToken,
  upload.single('product_image'),
  check('product_id').notEmpty().withMessage('Product id is required'),
  adminProductImageController.updateProductImage)
router.delete('/image/:productImageId', adminVerifyToken, adminProductImageController.deleteProductImage)
router.delete('/image/:productImageId/permanently', adminVerifyToken, adminProductImageController.hardDeleteProductImage)

module.exports = router