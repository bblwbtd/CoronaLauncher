<template>
  <v-select v-on="$listeners" v-bind="$attrs" :items="items" />
</template>

<script>
export default {
    data(ins) {
        return {
            items: ins.$store.state.versions.map(v => v.name)
        }
    }
}
</script>

<style>

</style>