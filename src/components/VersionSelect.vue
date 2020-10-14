<template>
    <v-select
        v-on="$listeners"
        v-bind="$attrs"
        :label="$t('Versions')"
        :items="finalVersions"
    >
        <template v-slot:prepend-item>
            <v-list-item>
                <v-checkbox
                    v-model="showRelease"
                    class="mr-3"
                    :label="$t('Release')"
                />
                <v-checkbox
                    v-model="showSnapShot"
                    class="mr-3"
                    :label="$t('Snapshot')"
                />
                <v-text-field v-model="search" :placeholder="$t('Search')" />
            </v-list-item>
        </template>
        <template v-slot:no-data>
            <v-list-item>{{ $t("NoData") }}</v-list-item>
        </template>
    </v-select>
</template>

<script>
export default {
    props: {
        versions: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        finalVersions: function() {
            return this.versions.filter(version => {

                if (!this.showRelease && (version.type === 'release' || version.type === 'old_alpha' || version.type === 'old_beta')) return false

                if (!this.showSnapShot && version.type === 'snapshot') return false

                return version.id.includes(this.search)
            }).map(v => ({ text: `${v.type} ${v.id}`, value: v.id }))
        }
    },
    data() {
        return {
            showRelease: true,
            showSnapShot: false,
            search: ''
        };
    }
};
</script>

<style></style>
