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
    const { username, name, password } = request.body
    const user = new User( { username, name, password } )
    const savedUser = await user.save()

    response.json( savedUser )
} )

module.exports = usersRouter