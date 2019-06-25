let arr = Symbol( 'arr' );

export default class Arr {
    constructor () {
        this[ arr ] = [];
    }

    get ( index ) {
        let arr = this[ arr ];
        if ( index < 0 ) {
            return arr[ arr.length + index ];
        }
        return arr[ index ];
    }

    len () {
        return this[ arr ].length;
    }
}
