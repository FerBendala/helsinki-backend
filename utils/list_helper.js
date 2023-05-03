const dummy = ( blogs ) => {
    return !blogs ? 1 : 0
}
const totalLikes = ( blogs ) => {
    const likes = blogs
        .reduce( ( like_sum, blog ) =>
            like_sum + blog.likes, 0
        )

    return likes
}

const favoriteBlog = ( blogs ) => {
    const maxLikes = blogs.reduce( ( prev, blog ) => Math.max( prev, blog.likes ), 0 )
    const favorite = blogs.find( blog => blog.likes === maxLikes )
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes,
    }
}

const mostBlogs = ( blogs ) => {
    const author =
        blogs
            .reduce( ( acc, blog ) => {
                acc[blog.author] = ~~acc[blog.author] + 1
                if ( ~~acc[blog.author] > acc.max ) {
                    acc.name = blog.author
                    acc.max = acc[blog.author]
                }
                return acc
            }, { name: '', max: 0 } )

    return {
        author: author.name,
        blogs: author.max
    }
}

const mostLikes = ( blogs ) => {
    const authorsAndLikes = blogs.reduce( ( acc, blog ) => {
        const existingAuthor = acc.find( a => a.name === blog.author )

        if ( existingAuthor ) {
            existingAuthor.likes += blog.likes
        } else {
            acc.push( { name: blog.author, likes: blog.likes } )
        }

        return acc
    }, [] )


    const maxLikes = Math.max( ...authorsAndLikes.map( item => item.likes ) )
    const author = authorsAndLikes.filter( item => item.likes === maxLikes )

    return {
        author: author[0].name,
        likes: author[0].likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}