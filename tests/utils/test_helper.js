const Blog = require( '../../models/blog' )
const User = require( '../../models/user' )
const initialBlogs = require( '../db/blogs.json' )
const initialUsers = require( '../db/users.json' )

const nonExistingId = async () => {
    const newBlog = new Blog( {
        title: 'async/await simplifies making async calls',
        author: 'FullStackOpen',
        url: 'www.fullstackopen.com',
        likes: 3
    } )

    await newBlog.save()
    await newBlog.deleteOne()

    return newBlog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find( {} )
    return blogs.map( blog => blog.toJSON() )
}

const usersInDb = async () => {
    const users = await User.find( {} )
    return users.map( u => u.toJSON() )
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    initialUsers,
    usersInDb,
}