<template>
    <div>
        <h1>index</h1>
    </div>
</template>

<script>
import ZPlainObj from '@lib/class/ZPlainObj'
import log from '@lib/class/ZLog'

export default {

    created () {
        let obj = new ZPlainObj( { _des: 'test' } )
        console.log( 'obj:', obj, log )
        window.log = log
        log.error( 'xxx' )
    }

}
</script>
