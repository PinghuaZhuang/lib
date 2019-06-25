var expect = require( 'expect.js' );

var z = require( '../../dist/index.aio.js' );

describe( 'is - 类型判断', function () {

    it( 'isInRange', function () {

        // @params: x, min, max
        expect( z.isInRange( 1 ) ).equal( true );
        expect( z.isInRange( 1, 2, 5 ) ).equal( false );
        expect( z.isInRange( 1, 5, 2 ) ).equal( false );
        expect( z.isInRange( 1, -1, 1 ) ).equal( true );
    } );

    it( 'isNumber', function () {
        expect( z.isNumber( 1 ) ).equal( true );
        expect( z.isNumber( '1' ) ).equal( false );
        expect( z.isNumber( '' ) ).equal( false );
        expect( z.isNumber( -0 ) ).equal( true );
        expect( z.isNumber( NaN ) ).equal( false );
        expect( z.isNumber( undefined ) ).equal( false );
        expect( z.isNumber( -Infinity ) ).equal( true );
    } );

    it( 'isBoolean', function () {
        expect( z.isBoolean( 1 ) ).equal( false );
        expect( z.isBoolean( true ) ).equal( true );
        expect( z.isBoolean( false ) ).equal( true );
        expect( z.isBoolean( undefined ) ).equal( false );
    } );

    it( 'isString', function () {
        expect( z.isString( 1 ) ).equal( false );
        expect( z.isString( '1' ) ).equal( true );
        expect( z.isString( '' ) ).equal( true );
        expect( z.isString( undefined ) ).equal( false );
    } );

    it( 'isEmptyString', function () {
        expect( z.isEmptyString( 1 ) ).equal( false );
        expect( z.isEmptyString( '1' ) ).equal( false );
        expect( z.isEmptyString( '  ' ) ).equal( true );
        expect( z.isEmptyString( '' ) ).equal( true );
        expect( z.isEmptyString( undefined ) ).equal( false );
    } );

    it( 'isNull', function () {
        expect( z.isNull( 1 ) ).equal( false );
        expect( z.isNull( '1' ) ).equal( false );
        expect( z.isNull( Object.create( null ) ) ).equal( false );
        expect( z.isNull( null ) ).equal( true );
        expect( z.isNull( undefined ) ).equal( false );
    } );

    it( 'isUndefined', function () {
        expect( z.isUndefined( 1 ) ).equal( false );
        expect( z.isUndefined( void 0 ) ).equal( true );
        expect( z.isUndefined( Object.create( null ) ) ).equal( false );
        expect( z.isUndefined( null ) ).equal( false );
        expect( z.isUndefined( undefined ) ).equal( true );
    } );

    it( 'isObject', function () {
        expect( z.isObject( {} ) ).equal( true );
        expect( z.isObject( void 0 ) ).equal( false );
        expect( z.isObject( Object.create( null ) ) ).equal( true );
        expect( z.isObject( [] ) ).equal( false );
        expect( z.isObject( undefined ) ).equal( false );
        ( function () {
            expect( z.isObject( arguments ) ).equal( true );
        } )();
    } );

    it( 'isFunction', function () {
        expect( z.isFunction( {} ) ).equal( false );
        expect( z.isFunction( void 0 ) ).equal( false );
        expect( z.isFunction( function () { } ) ).equal( true );
        expect( z.isFunction( Function ) ).equal( true );
    } );

    it( 'isPlainObject', function () {
        class Person { }

        expect( z.isPlainObject( Object.create( null ) ) ).equal( true );
        expect( z.isPlainObject( new Person ) ).equal( false );
        expect( z.isPlainObject( Function ) ).equal( false );

        expect( z.isPlainObject( {} ) ).equal( true );
        expect( z.isPlainObject( void 0 ) ).equal( false );
        expect( z.isPlainObject( [] ) ).equal( false );

        ( function () {
            expect( z.isPlainObject( arguments ) ).equal( false );
        } )();
    } );

    it( 'isArray', function () {
        expect( z.isArray( {} ) ).equal( false );
        expect( z.isArray( void 0 ) ).equal( false );
        expect( z.isArray( Object.create( null ) ) ).equal( false );
        expect( z.isArray( [] ) ).equal( true );
        expect( z.isArray( {
            0: 'x',
            length: 1
        } ) ).equal( false );
    } );

    it( 'isArrayLike', function () {
        expect( z.isArrayLike( {} ) ).equal( false );
        expect( z.isArrayLike( void 0 ) ).equal( false );
        expect( z.isArrayLike( Object.create( null ) ) ).equal( false );
        expect( z.isArrayLike( [] ) ).equal( true );
        expect( z.isArrayLike( {
            0: 'x',
            length: 1
        } ) ).equal( true );

        ( function () {
            expect( z.isArrayLike( arguments ) ).equal( true );
        } )();
    } );

    it( 'isEmptyObject', function () {
        expect( z.isEmptyObject( { } ) ).equal( true );
        expect( z.isEmptyObject( void 0 ) ).equal( false );
        expect( z.isEmptyObject( Object.create( null ) ) ).equal( true );
        expect( z.isEmptyObject( { name: 'null' } ) ).equal( false );
    } );
} );
