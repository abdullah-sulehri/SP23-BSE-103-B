const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
    {
    id:{
            type: Number,
            required: true,
            index: true,
            unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: null,
    },
    
    status: {
        type: String,
        required: true,
        lowercase: true, // true for active, false for inactive
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const category = mongoose.model('category', categorySchema);

module.exports = category;