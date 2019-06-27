import Emitter from '../../../../../src/class/Emitter'

describe( 'class', () => {
    it ( 'Emitter', ( ) => {
        let a = new Emitter()
        expect( typeof a ).toEqual( 'object' )
    } )
} )
