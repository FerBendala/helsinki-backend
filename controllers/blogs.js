const blogsRouter = require( 'express' ).Router()
const Blog = require( '../models/blog' )
const User = require( '../models/user' )

const jwt = require( 'jsonwebtoken' )

blogsRouter.get( '/', async ( request, response ) => {
    const blogs = await Blog
        .find( {} )
        .populate( 'user', {
            username: 1,
            name: 1,
        } )

    response.json( blogs )
} )

blogsRouter.post( '/', async ( request, response ) => {
    // Set variables
    const token = request.token
    const { title, author, url, likes, _id } = request.body

    // Verify if token is matching with SecretKey
    const decodedToken = jwt.verify( token, process.env.JWT_SECRET )
    if ( !decodedToken._id )
        return response
            .status( 401 )
            .json( { error: 'invalid user' } )


    // Find if token has a valid user id
    const tokenWithUserId = decodedToken._id
    const user = await User.findById( tokenWithUserId )

    // Set new Blog Schema
    const newBlog = new Blog( {
        title: title,
        author: author,
        url: url,
        likes: likes,
        user: user._id
    } )

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat( savedBlog._id )
    await user.save()

    response.json( savedBlog )
} )

blogsRouter.get( '/:id', async ( request, response ) => {
    const blog = await Blog.findById( request.params.id )

    // Return blog if exists
    if ( blog )
        response.json( blog )
    else
        response.status( 404 ).end()
} )

blogsRouter.delete( '/:id', async ( request, response ) => {
    // Set variables
    const [token, user] = [request.token, request.user]

    // Verify if token is matching with SecretKey
    const decodedToken = jwt.verify( token, process.env.JWT_SECRET )
    if ( !decodedToken._id )
        return response
            .status( 401 )
            .json( { error: 'invalid user' } )

    // Delete blog if the userId is matching with decoded token id
    const tokenWithUserId = decodedToken._id
    if ( user.toString() === tokenWithUserId.toString() ) {
        await Blog.findByIdAndRemove( request.params.id )
        response.status( 204 ).end()
    } else {
        return response.status( 401 ).json( { error: 'unauthorized' } )
    }
} )

blogsRouter.put( '/:id', async ( request, response ) => {
    // Set variables
    const [token, user] = [request.token, request.user]
    const { title, author, url, likes } = request.body

    // Verify if token is matching with SecretKey
    const decodedToken = jwt.verify( token, process.env.JWT_SECRET )
    if ( !decodedToken._id )
        return response
            .status( 401 )
            .json( { error: 'token missing or invalid' } )

    // Get elements from request and set new data for Blog Schema
    const tokenWithUserId = decodedToken._id
    const existingBlog = { title, author, url, likes }

    // Update blog if the userId is matching with decoded token id
    if ( user.toString() === tokenWithUserId.toString() ) {
        const updatedBlog = await Blog
            .findByIdAndUpdate(
                request.params.id,
                existingBlog,
                { new: true }
            )

        response.json( updatedBlog )
    } else {
        return response
            .status( 401 )
            .json( { error: 'unauthorized' } )
    }
} )

module.exports = blogsRouter