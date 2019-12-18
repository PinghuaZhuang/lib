<template>
    <div>
        <h1>Class</h1>
    </div>
</template>

<script>
import z from '../../../../src/utils/z'
import Vue from 'vue'
Vue.use( z )

export default {

    created () {
        console.log( '$z:', this.$z )
    }

}
</script>
