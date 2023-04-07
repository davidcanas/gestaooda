const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
   minecraft: {
        type: String,
        required: false,
        default: "Não especificado"
    },

    cargo: {
        type: String,
        required: false,
        unique: false
    },
    data_entrada: {
        type: String,
        required: false,
        unique: false
    },

    })

module.exports = mongoose.model('Staff', UserSchema)