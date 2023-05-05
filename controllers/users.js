const usersRouter = require( 'express' ).Router()
const User = require( '../models/user' )

usersRouter.get( '/', async ( request, response ) => {
    const users = await User
        .find( {}, 'username name' )
        .populate( 'blogs', {
            title: 1,
            author: 1,
        } )

    response.json( users )
} )

usersRouter.post( '/', async ( request, response ) => {
    // Set variables
    const { username, name, password } = request.body

    // Save new user
    const user = new User( { username, name, password } )
    const savedUser = await user.save()

    // Return saved user
    response.json( savedUser )
} )

module.exports = usersRouter