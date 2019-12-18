<template>
    <div>
        <h1 ref="h1" v-on:move:left="move">Event demo.</h1>
    </div>
</template>

<script>
import Move from '@lib/event/example'

export default {

    created () {
        this.$nextTick( () => {
            this.moveSensor = new Move( this.$refs.h1, { '_des': 'xxxx' } )
            this.moveSensor.attach()
        } )
    },

    methods: {
        move ( event ) {
        }
    }
}
</script>
