<template>
    <div>
        <h1>lib</h1>
        <el-progress
            class="progress"
            :key="1"
            :percentage="p.value * 100"
            status="exception"></el-progress>
        <el-progress
            :percentage="p.value * 100"
            :key="2"
            status="exception"></el-progress>
        <div class="block">
            <span class="demonstration">默认</span>
            <el-slider v-model="xxvalue"></el-slider>
        </div>
    </div>
</template>

<script>
import ZProgress from '../../../../src/class/ZProgress'

export default {
    name: 'ZProgress',
    data() {
        return {
            p: new ZProgress()
        }
    },
    computed: {
        xxvalue: {
            get() {
                return this.p.value * 100
            },
            set(value) {
                this.p.value = +value / 100
            },
        },
    },
    created() {
        console.log(`ZProgress:`, ZProgress)
        window.p = this.p


        console.log(`ZProgress2:`, p)
    },
}
</script>

<style lang="less">
.progress {
    width: 200px;
}
</style>
