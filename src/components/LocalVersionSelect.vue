<template>
  <v-select v-on="$listeners" v-bind="$attrs" :items="items" />
</template>

<script>
export default {
    props: {
        filter: {
            type: Function,
            default: () => true
        }
    },
    data(ins) {
        return {
            items: ins.$store.state.versions.filter(this.filter).map(v => v.name)
        }
    }
}
</script>

<style></style>
