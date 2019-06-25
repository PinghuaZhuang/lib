var expect = require( 'expect.js' )

var z = require( '../dist/index.aio.js' )
var Arr = z.Arr

class PlainObj {}
let pb = new PlainObj(), tp

describe( 'Arr', function () {

    it( 'new', function () {
        expect( new Arr().length ).equal( 0 )
        expect( new Arr( [ 1 ] ).length ).equal( 1 )
        expect( new Arr( [ new PlainObj(), new PlainObj() ], {
            type: PlainObj
        } ).length ).equal( 2 )
    } )

    it( 'push', function () {

        expect( new Arr( [ new PlainObj(), 1 ], {
            type: PlainObj
        } ).push( 1 ) ).equal( 1 )

        expect( new Arr( [ new PlainObj(), new PlainObj() ], {
            type: PlainObj
        } ).push( new PlainObj(), new PlainObj ) ).equal( 4 )

        tp = new Arr( [ new PlainObj(), new PlainObj() ], {
            type: PlainObj
        } )
        tp.push( pb, new PlainObj() )

        expect( tp.get( -2 ) ).equal( pb )
    } )

    it( 'unshift', function () {

        expect( new Arr( [ new PlainObj(), new PlainObj() ], {
            type: PlainObj
        } ).unshift( 1 ) ).equal( 2 )

        expect( new Arr( [ new PlainObj(), new PlainObj() ], {
            type: PlainObj
        } ).unshift( new PlainObj(), new PlainObj ) ).equal( 4 )

        tp = new Arr( [ new PlainObj(), new PlainObj() ], {
            type: PlainObj
        } )
        tp.unshift( pb, new PlainObj() )

        expect( tp.get( 1 ) ).equal( pb )
    } )

    it( 'pop', function () {
        expect( new Arr( [ new PlainObj(), pb ], {
            type: PlainObj
        } ).pop() ).equal( pb )

        tp = new Arr( [ pb, pb ], {
            type: PlainObj
        } )

        expect( tp.pop( 2 ).length ).equal( 2 )
        expect( tp.length ).equal( 0 )
    } )

    it( 'shift', function () {

        expect( new Arr( [ pb, new PlainObj() ], {
            type: PlainObj
        } ).shift() ).equal( pb )

        tp = new Arr( [ new PlainObj(), pb ], {
            type: PlainObj
        } )

        let target = tp.shift( 2 )

        expect( tp.valueOf() ).equal( undefined )
        expect( target.length ).equal( 2 )
    } )
} )
