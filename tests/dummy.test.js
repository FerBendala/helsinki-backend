const listHelper = require( '../utils/list_helper' )
const blogs = require( './_.json' )

describe( 'dummy test', () => {
    test( 'dummy returns one', () => {
        const result = listHelper.dummy()
        expect( result ).toBe( 1 )
    } )
} )

describe( 'From manual db => ./_.db.js', () => {
    test( 'total likes returns 36', () => {
        const result = listHelper.totalLikes( blogs )
        expect( result ).toBe( 36 )
    } )

    test( 'favorite blog founded', () => {
        const result = listHelper.favoriteBlog( blogs )
        expect( result ).toEqual( {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12
        } )
    } )

    test( 'most blogs writted return 3', () => {
        const result = listHelper.mostBlogs( blogs )
        expect( result ).toEqual( {
            author: 'Robert C. Martin',
            blogs: 3
        } )
    } )

    test( 'most post liked return 17', () => {
        const result = listHelper.mostLikes( blogs )
        expect( result ).toEqual( {
            author: 'Edsger W. Dijkstra',
            likes: 17
        } )
    } )
} )
