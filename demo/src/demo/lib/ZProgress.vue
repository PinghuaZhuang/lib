<template>
    <div>
        <h1>lib</h1>
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
