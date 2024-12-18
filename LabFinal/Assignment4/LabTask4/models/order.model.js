const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    customer: {
        name: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    orderItems: [
        {
            productId: { type: Number, ref: 'Product', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
           
        },
    ],
    orderTotal: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);