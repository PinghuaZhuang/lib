var expect = require( 'expect.js' );

var z = require( '../../dist/index.aio.js' );

describe( 'core.js', function () {

    describe( 'extend-拷贝', function () {

        var origin = {
            name: 'zp.extend',
            friend: {
                cp: 'hunan'
            }
        };

        // 浅拷贝
        var t1 = {};

        // 深拷贝
        var t2 = {};

        it( '浅拷贝', () => {
            z.extend( t1, origin );
            expect( t1.name ).equal( 'zp.extend' );
            expect( t1.friend.cp ).equal( 'hunan' );
            origin.friend.cp = 'xxxx';
            expect( t1.friend.cp ).equal( 'xxxx' );
        } );

        it( '深拷贝', function () {
            z.extend( true, t2, origin );
            expect( t2.name ).equal( 'zp.extend' );
            expect( t1.friend.cp ).equal( 'xxxx' );
            origin.friend.cp = 'kkkk';
            expect( t1.friend.cp ).equal( 'kkkk' );
        } );

        it( '特殊情况', function () {
            expect( z.isEmptyObject( z.extend( {}, undefined ) ) ).equal( true );
        } );
    } );

    // describe( 'grep-过滤器', function () {
    //     var arr = [ 1, 2, 3, 4 ];

    //     it( '正选', function () {
    //         var ret;
    //         ret = z.grep( arr, function ( ele, index ) {
    //             return ele % 2;
    //         } );
    //         expect( ret.length ).equal( 2 );
    //         expect( ret[ 0 ] ).equal( 1 );
    //     } );

    //     it( '反选', function () {
    //         var ret;
    //         ret = z.grep( arr, function ( ele, index ) {
    //             return ele % 2;
    //         }, true );
    //         expect( ret.length ).equal( 2 );
    //         expect( ret[ 0 ] ).equal( 2 );
    //     } );
    // } );

    describe( 'createCache-缓存', function () {

        it( 'set-get', function () {
            var cache = z.createCache();

            cache( 'a', 11 );
            cache( 'b', 22 );

            expect( cache( 'a' ) ).equal( 11 );
            expect( cache( 'b' ) ).equal( 22 );
        } );
    } );
} );
