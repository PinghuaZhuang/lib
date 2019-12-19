/* eslint-disable */

/**
 * Vue 基础包
 * @version 1.0.0
 */

import z from '../../utils/z'

const VERSION = '1.0.0'

const $base = {
    version: VERSION,
    isDev: process.env.NODE_ENV !== 'production',
}

const $dialog = {
    version: VERSION,
}

if ( $base.isDev ) {
    window.$base = $base
}

export default {
    install ( Vue ) {
        Object.assign( Vue.prototype, {
            $base: {},
            $dialog: {},
        } )
    }
}
