import Move from '../../../../src/event/example'

describe( 'Event', () => {
    let target = {}
    let div = document.createElement( 'div' )
    let divSensor = new Move( div, {
        _des: 'test'
    } )
    // window.document.append( div )

    it( 'new-on-trigger', () => {
        divSensor.on( 'move:left', ( event ) => {
            target.count = 1
        } )
        window.addEventListener( 'click', () => {
            window.setTimeout( () => {
                expect( target.count ).toEqual( 1 )
            }, 100 )
        } )
        window.document.body.click()
    } )
} )
