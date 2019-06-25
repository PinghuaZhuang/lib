var expect = require( 'expect.js' );

var z = require( '../../dist/index.aio.js' );

describe( 'utils', function () {

    describe( 'getUUID', function () {
        it( 'get', () => {
            var a = z.getUUID()
            var b = z.getUUID()
            expect( a ).to.not.equal( b );
            expect( a.length ).equal( 36 );
        } );
    } );
} );
