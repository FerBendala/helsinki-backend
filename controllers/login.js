const jwt = require( 'jsonwebtoken' )
const bcrypt = require( 'bcrypt' )
const loginRouter = require( 'express' ).Router()
const User = require( '../models/user' )


loginRouter.post( '/', async ( request, response ) => {
    // Set variables
    const { username, password } = request.body

    // Verify if user exists and check if password is correct
    const user = await User.findOne( { username } )
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare( password, user.password )

    if ( !( user && passwordCorrect ) ) {
        return response.status( 401 ).json( {
            error: 'invalid username or password'
        } )
    }

    // If user is verificated generate new token
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    const token = jwt.sign(
        userForToken,
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 }
    )

    // Return status 200 with user data
    response
        .status( 200 )
        .send( {
            token,
            username: user.username,
            name: user.name
        } )
} )

module.exports = loginRouter