<template>
    <div>
        <v-badge
            v-if="$store.state.missions.filter(mission => mission.state === 'Downloading').length"
            inline
            :content="$store.state.missions.filter(mission => mission.state === 'Downloading').length"
        >
            <v-icon id="icon" @click="switch_to_download">mdi-download</v-icon>
        </v-badge>
        <v-icon v-else id="icon" @click="switch_to_download">mdi-download</v-icon>
    </div>
</template>

<script>
export default {
    methods: {
        switch_to_download() {
            this.$router.push('/download')
        }
    }
}
</script>

<style scoped>
#icon {
    cursor: pointer;
}
</style>