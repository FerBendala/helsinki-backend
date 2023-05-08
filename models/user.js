const mongoose = require( 'mongoose' )
const uniqueValidator = require( 'mongoose-unique-validator' )
const bcrypt = require( 'bcrypt' )


const userSchema = new mongoose.Schema( {
    username: {
        type: String,
        minLength: 3,
        unique: true,
    },
    name: String,
    password: {
        type: String,
        minLength: 3,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
        }
    ],
} )

userSchema
    .plugin( uniqueValidator )
    .pre( 'save', async function ( next ) {
        if ( !this.isModified( 'password' ) ) {
            return next()
        }

        const saltRounds = 10
        const paswordHash = await bcrypt.hash(
            this.password, saltRounds
        )
        this.password = paswordHash

        next()
    } )
    .set( 'toJSON', {
        transform: ( document, returnedObject ) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    } )

const User = mongoose.model( 'User', userSchema )
module.exports = User