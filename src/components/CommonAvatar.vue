<template>
    <v-avatar tile v-on="$listeners" v-bind="$attrs">
        <v-img :src="src" @error="src = 'https://minotar.net/avatar/Steve'" />
    </v-avatar>
</template>

<script>
export default {
    props: [
        'name'
    ],
    watch: {
        name: function(newName) {
            this.src = `https://minotar.net/avatar/` + newName
        }
    },
    data() {
        return {
            src: `https://minotar.net/avatar/` + this.name
        }
    }
}
</script>

<style>
</style>