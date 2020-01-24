<template>
    <div>
        <h1>lib</h1>
        <el-progress
            class="progress"
            :key="1"
            :percentage="p.value"
            status="exception"></el-progress>
        <el-progress
            :percentage="p.value"
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
                return this.p.value
            },
            set(value) {
                this.p.value = value
            },
        },
    },
    created() {
        console.dir(ZProgress)
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
