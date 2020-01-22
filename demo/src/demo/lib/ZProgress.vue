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
