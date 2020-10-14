<template>
    <v-form ref="form">
        <v-text-field :rules="rules" v-model="link" :placeholder="$t('PleaseInputLink')" />
    </v-form>
</template>

<script>
import { decodeLink } from '../scripts/protocol'
import { clipboard } from 'electron'

export default {
    computed: {
        rules() {
            return [
                (v) => {
                    if (!v) {
                        return this.$t('CanNotBeEmpty')
                    }

                    if (!v.startsWith('minecraft')) {
                        return this.$t('InvalidaLink')
                    }

                    if (decodeLink(v)) {
                        return true
                    }
                    return this.$t('InvalidaLink')
                }
            ]
        }
    },
    mounted() {
        const text = clipboard.readText()
        this.link = decodeLink(text)
    },
    data() {
        return {
            link: undefined
        }
    },
    methods: {
        getServerInfo() {
            if (this.$refs.form.validate()) {
                return decodeLink(this.link)
            }
            return undefined
        },
        reset() {
            this.$refs.form.reset()
        }
    }
};
</script>

<style></style>
