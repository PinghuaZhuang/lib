import ZEmitter from '../../../../src/class/ZEmitter';

describe( 'Class', () => {
    it( 'ZEmitter', () => {
        let obj = {}, fn
        let $emitter = new ZEmitter( { '_des': test } )
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
} )
