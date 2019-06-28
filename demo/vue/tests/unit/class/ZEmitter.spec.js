import ZEmitter from '../../../../../src/class/ZEmitter';

describe( 'ZEmitter', () => {
    let obj = {}, fn
    let $emitter = new ZEmitter( { '_des': test } )

    it( 'on-trigger', () => {
        $emitter.on( 'xxx', fn = ( event ) => { event.obj.name = 'xxx' } )
        $emitter.trigger( {
            type: 'xxx',
            obj
        } )
        expect( obj.name ).toEqual( 'xxx' )

        obj.name = ''
        $emitter.off( 'xxx', fn )
        $emitter.trigger( {
            type: 'xxx',
            obj
        } )
        expect( obj.name ).toEqual( '' )
    } )

    it( 'off', () => {
        obj.name = ''
        $emitter.off( 'xxx', fn )
        $emitter.trigger( {
            type: 'xxx',
            obj
        } )
        expect( obj.name ).toEqual( '' )
    } )

    it( 'config-callbackOptions', () => {
        obj.count = 0
        $emitter = new ZEmitter( { config: { once: true } } )
        $emitter.on( 'add', ( { obj } ) => {
            obj.count++
        } )
        $emitter.trigger( {
            type: 'add',
            obj
        } )
        $emitter.trigger( {
            type: 'add',
            obj
        } )
        expect( obj.count ).toEqual( 1 )
    } )
} )
