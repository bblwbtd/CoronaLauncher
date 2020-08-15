<template>
    <v-dialog v-bind="$attrs" v-on="$listeners">
        <v-card flat>
            <v-card-title>{{title}}</v-card-title>
            <v-card-text>{{content}}</v-card-text>
            <v-card-actions>
                <v-spacer />
                <slot>
                    <v-btn text color="orange" @click="cancel">{{$t('Cancel')}}</v-btn>
                    <v-btn text color="green" @click="confirm">{{$t('Confirm')}}</v-btn>
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [
        'title',
        'content'
    ],
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        confirm() {
            this.$emit('confirm')
        }
    }
}
</script>

<style>
</style>