<template>
  <v-snackbar v-model="show">{{message}}</v-snackbar>
</template>

<script>
import {subscribe} from '@/plugins/message.js'

export default {
    name: 'Message',
    mounted() {
        subscribe(this.display)
    },
    data() {
        return {
            message: '',
            show: false,
        }
    },
    methods: {
        display(message){
            this.message = message;
            this.show = true;
        }
    }
}
</script>

<style>

</style>