<template>
    <div>
        <!-- <input v-money.3="value" /> -->
        <!-- <el-input v-money.3="value" :color="'red'"></el-input> -->
        <el-input v-model="value" v-currency></el-input>
    </div>
</template>

<script>
import z from '../../../../src/vue/utils/z'
import Vue from 'vue'
import '../../../../src/vue/directive/v-currency'
Vue.use( z )

export default {

    data () {
        return {
            value: 'xxxxx',
            color: 'red',
        }
    },

    created () {
        console.log( '$z:', this.$z )
    }

}
</script>
