<template>
    <div>
        <h1 ref="h1" v-on:move:left="move">Event demo.</h1>
    </div>
</template>

<script>
import Move from '@lib/event/example'
import zlog from '@lib/class/ZLog'
// import XXX from '../../../xx'

export default {

    created () {
        this.$nextTick( () => {
            this.moveSensor = new Move( this.$refs.h1, { '_des': 'xxxx' } )
            this.moveSensor.attach()
            zlog.log( this.moveSensor )
        } )
    },

    methods: {
        move ( event ) {
            zlog.log( 'move:left===', event )
        }
    }
}
</script>
