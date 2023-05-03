const blogsRouter = require( 'express' ).Router()
const Blog = require( '../models/blogs' )

blogsRouter.get( '/', async ( request, response ) => {
    const blogs = await Blog.find( {} )
    response.json( blogs )
} )

blogsRouter.get( '/:id', async ( request, response ) => {
    const blog = await Blog.findById( request.params.id )

    if ( blog ) {
        response.json( blog )
    } else {
        response.status( 404 ).end()
    }
} )

blogsRouter.post( '/', async ( request, response ) => {
    const body = request.body
    const newBlog = new Blog( {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    } )

    const savedBlog = await newBlog.save()
    response.json( savedBlog )
} )

blogsRouter.delete( '/:id', async ( request, response ) => {
    console.log( request.params.id )
    await Blog.findByIdAndRemove( request.params.id )
    response.status( 204 ).end()
} )

module.exports = blogsRouter