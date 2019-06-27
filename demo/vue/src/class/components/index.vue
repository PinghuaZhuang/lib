<template>
    <div>
        <h1>index</h1>
    </div>
</template>

<script>
import ZPlainObj from '@lib/class/ZPlainObj'

export default {

    created () {
        let obj = new ZPlainObj( { _des: 'test' } )
        console.log( 'obj:', obj )
    }

}
</script>
