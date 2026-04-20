const express = require("express")
const createAuthMiddleware = require("../middleware/auth.middleware")
const orderController = require("../controllers/order.controller")
const validation = require("../middleware/validation.middleware")

const router = express.Router()


router.post("/", createAuthMiddleware(["user"]), validation.createOrderValidation, orderController.createOrder)
router.get('/me', createAuthMiddleware(['user']), orderController.getMyOrders)
router.get('/:id', createAuthMiddleware(['user']), orderController.getOrderById)
router.patch('/:id/address', createAuthMiddleware(['user']),validation.updateAddressValidation, orderController.updateAddress)
router.post('/:id/cancel', createAuthMiddleware(['user']), orderController.cancelOrder)

module.exports = router;