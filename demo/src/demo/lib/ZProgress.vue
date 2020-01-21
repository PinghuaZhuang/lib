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
        return {}
    },
    created() {
        console.log(`ZProgress:`, ZProgress)

        let p = new ZProgress()

        console.log(`ZProgress2:`, p)
    },
}
</script>
