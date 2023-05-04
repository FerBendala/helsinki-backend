const mongoose = require( 'mongoose' )
const supertest = require( 'supertest' )
const helper = require( './utils/test_helper' )
const app = require( '../app.js' )
const api = supertest( app )
const Blog = require( '../models/blogs' )


beforeEach( async () => {
    await Blog.deleteMany( {} )
    for ( let blog in helper.initialBlogs ) {
        const blogs = helper.initialBlogs
        const blogObject = new Blog( blogs[blog] )
        await blogObject.save()
    }
} )

describe( 'when there is initially some blogs saved', () => {
    test( 'blogs are returned as a json', async () => {
        await api
            .get( '/api/blogs' )
            .expect( 200 )
            .expect( 'Content-Type', /application\/json/ )
    } )

    test( 'all blogs are returned', async () => {
        const response = await api.get( '/api/blogs' )
        expect( response.body ).toHaveLength(
            helper.initialBlogs.length
        )
    } )

    test( 'a specific blog is within the returned blogs', async () => {
        const response = await api.get( '/api/blogs' )

        const titles = response.body.map( blog => blog.title )
        expect( titles ).toContain( 'Este es un título cualquiera' )
    } )
} )

describe( 'viewing a specific blog', () => {
    test( 'succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get( `/api/blogs/${blogToView.id}` )
            .expect( 200 )
            .expect( 'Content-Type', /application\/json/ )

        const processedBlogToView = JSON.parse( resultBlog.text )
        expect( resultBlog.body ).toEqual( processedBlogToView )
    } )

    test( 'fails with statuscode 404 if blog does not exist', async () => {
        const validNonExistingId = await helper.nonExistingId()
        await api
            .get( `/api/blogs/${validNonExistingId}` )
            .expect( 404 )
    } )

    test( 'fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
        await api
            .get( `/api/blogs/${invalidId}` )
            .expect( 400 )
    } )
} )

describe( 'addition of a new blog', () => {
    test( 'succeeds with valid data', async () => {
        const newBlog = {
            title: 'La corona de la vida está en el ejercicio de la propia elección',
            author: 'Julio César',
            url: 'www.juliocesar.com',
            likes: 3
        }

        await api
            .post( '/api/blogs' )
            .send( newBlog )
            .expect( 200 )
            .expect( 'Content-Type', /application\/json/ )

        const blogsAtEnd = await helper.blogsInDb()
        expect( blogsAtEnd ).toHaveLength(
            helper.initialBlogs.length + 1
        )

        const titles = blogsAtEnd.map( r => r.title )
        expect( titles ).toContain( 'La corona de la vida está en el ejercicio de la propia elección' )

        const ids = blogsAtEnd.map( r => r.id )
        expect( ids ).toBeDefined()
    } )

    test( 'a blog can be added without likes', async () => {
        const newBlog = {
            title: 'La corona de la vida está en el ejercicio de la propia elección',
            author: 'Julio César',
            url: 'www.juliocesar.com',
        }

        await api
            .post( '/api/blogs' )
            .send( newBlog )
            .expect( 200 )
            .expect( 'Content-Type', /application\/json/ )

        const blogsAtEnd = await helper.blogsInDb()
        expect( blogsAtEnd ).toHaveLength(
            helper.initialBlogs.length + 1
        )

        const lastBlogAdded = blogsAtEnd[helper.initialBlogs.length]
        expect( lastBlogAdded.likes ).toEqual( 0 )
    } )

    test( 'fails with status code 400 if data is invalid', async () => {
        const newBlog = {
            author: 'Julio César',
            likes: 5
        }

        await api
            .post( '/api/blogs' )
            .send( newBlog )
            .expect( 400 )

        const blogsAtEnd = await helper.blogsInDb()
        expect( blogsAtEnd ).toHaveLength(
            helper.initialBlogs.length
        )
    } )
} )

describe( 'deletion of a blog', () => {
    test( 'succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete( `/api/blogs/${blogToDelete.id}` )
            .expect( 204 )

        const blogsAtEnd = await helper.blogsInDb()
        expect( blogsAtEnd ).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map( r => r.title )
        expect( titles ).not.toContain( blogToDelete.title )
    } )
} )

describe( 'update information of a blog', () => {
    test( 'succeeds with status code 200 if update blog is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {
            ...blogsAtStart[0],
            title: 'Mentir a los demás es como mentirse a uno mismo',
        }

        await api
            .put( `/api/blogs/${blogToUpdate.id}` )
            .send( updatedBlog )
            .expect( 200 )
            .expect( 'Content-Type', /application\/json/ )

        const blogsAtEnd = await helper.blogsInDb()
        expect( blogsAtEnd ).toHaveLength( helper.initialBlogs.length )

        const titles = blogsAtEnd.map( r => r.title )
        expect( titles ).toContain( updatedBlog.title )
    } )
} )


afterAll( () => {
    mongoose.connection.close()
} )