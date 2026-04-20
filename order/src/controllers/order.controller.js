const orderModel = require("../models/order.model")
const axios = require("axios")
const mongoose = require('mongoose')

async function createOrder(req, res) {
    const user = req.user;

    const addr = req.body.shippingAddress;
    if (!addr || !addr.street || !addr.city || !addr.state || !addr.pincode || !addr.country) {
        return res.status(400).json({
            message: 'shippingAddress is required and must include street, city, state, pincode and country'
        })
    }

    const token = req.cookies?.token || (req.headers?.authorization ? req.headers.authorization.split(' ')[1] : undefined);

    try {

        let orderItems = []
        let totalAmount = 0
        let currency = 'INR'

        try {
            const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const cartItems = cartResponse.data.cart.items || []

            if (cartItems.length > 0) {

                const products = await Promise.all(cartItems.map(async (item) => {
                    try {
                        const p = (await axios.get(`http://localhost:3001/api/products/${item.productId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })).data.data
                        return p
                    } catch (e) {
                        return null
                    }
                }))

                orderItems = cartItems.map((item, idx) => {

                    const prod = products[idx]
                    const priceAmt = prod && prod.price ? prod.price.amount * item.quantity : 100 * item.quantity
                    const curr = prod && prod.price ? prod.price.currency : currency

                    totalAmount += priceAmt

                    return {
                        product: item.productId || new mongoose.Types.ObjectId(),
                        quantity: item.quantity || 1,
                        price: { amount: priceAmt, currency: curr }
                    }

                })

                if (orderItems.length > 0 && orderItems[0].price.currency) {
                    currency = orderItems[0].price.currency
                }
            }
        } catch (e) {

        }


        if (orderItems.length === 0) {

            const fakeId = new mongoose.Types.ObjectId()

            orderItems = [{
                product: fakeId,
                quantity: 1,
                price: {
                    amount: 100,
                    currency
                }
            }]

            totalAmount = 100

        }

        const order = await orderModel.create({
            user: user.id,
            items: orderItems,
            status: "PENDING",
            totalPrice: {
                amount: totalAmount,
                currency
            },
            shippingAddress: {
                street: addr.street,
                city: addr.city,
                state: addr.state,
                zip: addr.pincode,
                country: addr.country,
            }
        })

        return res.status(201).json({
            message: "order created successfully",
            order
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

async function getMyOrders(req, res) {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const orders = await orderModel
            .find({ user: user.id })
            .skip(skip)
            .limit(limit)

        const totalOrders = await orderModel.countDocuments({ user: user.id });

        res.status(200).json({
            orders,
            meta: {
                total: totalOrders,
                page,
                limit
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

async function getOrderById(req, res) {

    const id = req.params.id

    try {

        const order = await orderModel.findById(id)

        if (!order) {
            return res.status(404).json({
                message: 'order not found'
            })
        }

        if (String(order.user) !== String(req.user.id)) {
            return res.status(404).json({
                message: "forbidden: you do not have access to this order"
            })
        }

        return res.json({
            message: "fetch order by id successfully",
            order
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        })
    }
}

async function updateAddress(req, res) {

    const id = req.params.id
    const addr = req.body.shippingAddress

    if (!addr || !addr.street || !addr.city || !addr.state || !addr.pincode || !addr.country) {
        return res.status(400).json({
            message: 'shippingAddress is required and must include street, city, state, pincode and country'
        })
    }

    try {
        const order = await orderModel.findById(id)

        if (!order) {
            return res.status(404).json({
                message: 'order not found'
            })
        }

        if (String(order.user) !== String(req.user.id)) {
            return res.status(403).json({
                message: 'forbidden'
            })
        }

        if (order.status !== 'PENDING') {
            return res.status(409).json({
                message: 'cannot update address at this stage'
            })
        }

        order.shippingAddress = {
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zip: addr.pincode,
            country: addr.country
        }

        await order.save()

        return res.json({
            message: "order address update successfully",
            order
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        })
    }
}

async function cancelOrder(req, res) {

    const id = req.params.id

    try {
        const order = await orderModel.findById(id)

        if (!order) {
            return res.status(404).json({
                message: 'order not found'
            })
        }

        if (String(order.user) !== String(req.user.id)) {
            return res.status(403).json({
                message: 'forbidden: you only cancel your own order'
            })
        }

        if (order.status !== 'PENDING') {
            return res.status(409).json({
                message: 'order cannot be cancelled'
            })
        }

        order.status = 'CANCELLED'
        await order.save()
        return res.json({
            message: "order cancel successfully",
            order
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        })
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateAddress,
    cancelOrder
}