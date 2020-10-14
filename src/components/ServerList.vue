<template>
  <v-list>
    <ServerItem 
        :key="server.title" 
        v-for="server in servers" 
        :server="server"
        :onLaunch="onLaunch"
        :onDelete="onDelete"
        :onEdit="onEdit"
    />
  </v-list>
</template>

<script>
import ServerItem from './ServerItem'

export default {
    components: {
        ServerItem
    },
    props: {
        servers: Array,
        onLaunch: Function,
        onDelete: Function,
        onEdit: Function
    },
    methods: {

    }
}
</script>

<style>

</style>