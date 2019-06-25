import rnothtmlwhite from './rnothtmlwhite';

let class2type = {};

export const types = 'Boolean Number String Function Array Date RegExp Object Error Symbol'
    .match( rnothtmlwhite );

let i = 0, len = types.length, name;

for ( ; i < len; i++ ) {
    name = types[ i ];
    class2type[ `[object ${name}]` ] = name.toLowerCase();
}

export default class2type;
