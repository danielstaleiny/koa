const mongoose = require('mongoose')
const uuid = require('uuid')

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        default: () => uuid.v4()
    },
    text: { type: String, required: true }
})

// toJSON for external representation.
userSchema.method('toJSON', function() {
    return {
        id: this.id,
        text: this.text
    }
})

userSchema.pre('save', function(next) {
    this.increment()
    next()
})

var User = mongoose.model('User', userSchema)

//example
User.getById = () => console.log('getById')

module.exports = User
