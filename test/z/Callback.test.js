var expect = require( 'expect.js' );

var z = require( '../../dist/index.aio.js' );

describe( 'Callbacks', function () {
    var arr = [];
    var target = [ 'fn5', 'fn6' ];
    function fn1 () {
        arr.push( 1 );
    }
    function fn2 () {
        arr.push( 2 );
    }
    function fn3 () {
        arr.push( 'fn3' );
    }
    function fn4 () {
        return false;
    }
    function fn5 () {
        arr.push( this[ 0 ] );
    }
    function fn6 () {
        arr.push( this[ 1 ] );
    }
    function fn7 ( name ) {
        arr = [];
        arr.push( name );
    }
    function fn8 () {
        this.lock();
    }
    function fn9 () {
        this.disable();
    }

    it( 'add-fire', function () {
        var cfn = z.Callbacks();
        arr = [];
        cfn.add( fn1, [ fn2 ] );
        cfn.fire();
        cfn.fire();
        expect( arr[ 0 ] ).equal( 1 );
        expect( arr[ 1 ] ).equal( 2 );
        expect( arr.length ).equal( 4 );

        arr = [];
        cfn.empty().add( fn1, fn1, fn1 ).fire();
        expect( arr.length ).equal( 3 );
        expect( arr[ 2 ] ).equal( 1 );

        cfn.empty().add( fn7 ).fire( 'fn7' );
        expect( arr[ 0 ] ).equal( 'fn7' );
        expect( arr[ 1 ] ).equal( undefined );
        expect( arr.length ).equal( 1 );
    } );

    it( 'remove', function () {
        var cfn = z.Callbacks();
        arr = [];
        cfn.add( fn1, [ fn2 ], fn2 ).remove( fn2 );
        cfn.fire();
        expect( arr[ 0 ] ).equal( 1 );
        expect( arr.length ).equal( 1 );
    } );

    it( 'has', function () {
        var cfn = z.Callbacks();
        arr = [];
        cfn.add( fn1, [ fn2 ], fn2 );
        expect( cfn.has( fn1 ) ).equal( true );
    } );

    it( 'empty', function () {
        var cfn = z.Callbacks();
        arr = [];
        cfn.add( fn1, [ fn2 ], fn2 ).empty().fire();
        expect( arr.length ).equal( 0 );
    } );

    it( 'once', function () {
        var cfn = z.Callbacks( 'once' );
        arr = [];
        cfn.add( fn1, [ fn2 ] );
        cfn.fire();
        cfn.fire();
        expect( arr.length ).equal( 2 );
    } );

    it( 'memory', function () {
        var cfn = z.Callbacks( 'memory' );
        arr = [];
        cfn.add( fn1, [ fn2 ] );
        cfn.fire();
        cfn.add( fn3 );
        expect( arr[ 2 ] ).equal( 'fn3' );
    } );

    it( 'unique', function () {
        var cfn = z.Callbacks( 'unique' );
        arr = [];
        cfn.add( fn1, [ fn2, fn1, fn1 ] );
        cfn.fire();
        expect( arr[ 0 ] ).equal( 1 );
        expect( arr[ 1 ] ).equal( 2 );
        expect( arr.length ).equal( 2 );
    } );

    it( 'stopOnFalse', function () {
        var cfn = z.Callbacks( 'stopOnFalse' );
        arr = [];
        cfn.add( fn1, fn4, fn2 );
        cfn.fire();
        expect( arr[ 0 ] ).equal( 1 );
        expect( arr[ 1 ] ).equal( undefined );
        expect( arr.length ).equal( 1 );
    } );

    it( 'fireWith', function () {
        var cfn = z.Callbacks();
        arr = [];
        cfn.add( fn5, fn6 ).fireWith( target );
        expect( arr[ 0 ] ).equal( 'fn5' );
        expect( arr[ 1 ] ).equal( 'fn6' );
        expect( arr.length ).equal( 2 );
    } );

    it( 'lock & locked', function () {
        var cfn = z.Callbacks();
        arr = [];
        cfn.add( fn1, fn8, fn2 ).fireWith( cfn );
        expect( arr[ 0 ] ).equal( 1 );
        expect( arr[ 1 ] ).equal( 2 );
        expect( arr.length ).equal( 2 );
        expect( cfn.locked() ).equal( true );
    } );

    it( 'disable & disabled', function () {
        var cfn = z.Callbacks();
        arr = [];
        cfn.add( fn1, fn9, fn2 ).fireWith( cfn );
        expect( arr[ 0 ] ).equal( 1 );
        expect( arr[ 1 ] ).equal( undefined );
        expect( arr.length ).equal( 1 );
        expect( cfn.disabled() ).equal( true );
    } );
} );
