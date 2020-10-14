<template>
    <v-form ref="form">
        <v-text-field
            :label="$t('ServerName')"
            v-model="formData.title"
            :rules="nameRules"
        ></v-text-field>
        <v-row no-gutters>
            <v-col cols="10">
                <v-text-field
                    class="mr-3"
                    label="Host"
                    v-model="formData.host"
                ></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-text-field
                    :rules="portRules"
                    type="number"
                    label="Port"
                    v-model="formData.port"
                ></v-text-field>
            </v-col>
        </v-row>
        <LocalVersionSelect v-model="formData.version" :label="$t('Version')" />
    </v-form>
</template>

<script>
import LocalVersionSelect from "./LocalVersionSelect";

export default {
    name: "ServerConfigForm",
    components: {
        LocalVersionSelect
    },
    props: {
        defaultFormData: {
            type: Object,
            default: () => ({
                title: undefined,
                host: undefined,
                port: 25565,
                version: undefined
            })
        }
    },
    data(ins) {
        return {
            formData: {...ins.defaultFormData}
        };
    },
    computed: {
        portRules() {
            return [
                v => {
                    if (v > 65535 || v < 1) {
                        return this.$t("InvalidPort");
                    }
                    return true;
                }
            ];
        },
        nameRules() {
            return [
                v => {
                    if (!v) {
                        return this.$t("CanNotBeEmpty");
                    }

                    if (v.length > 30) {
                        return this.$t("NameIsTooLong");
                    }

                    if (v.length < 3) {
                        return this.$t("NameIsTooShort");
                    }

                    return true;
                }
            ];
        },
        versionsRules() {
            return [
                v => {
                    if (!v) {
                        return this.$t("CanNotBeEmpty");
                    }
                    return true;
                }
            ];
        },
    },
    watch: {
        formData: {
            deep: true,
            handler() {
                this.validate();
            }
        }
    },
    methods: {
        validate() {
            this.$refs.form.validate();
        },
        reset() {
            this.formData = {...this.defaultFormData}
            this.$refs.form.resetValidation();
        }
    }
};
</script>

<style></style>
