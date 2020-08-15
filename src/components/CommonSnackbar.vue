<template>
  <v-snackbar app bottom v-model="visible">
      {{content}}
      <template v-slot:action>
          <v-btn
            text
            @click="close"
            color="green"
          >
            {{$t('Close')}}
          </v-btn>
      </template>
  </v-snackbar>
</template>

<script>
export default {
    data: () => ({
      content: '',
      visible: false
    }),
    methods: {
      show(content){
        this.content = content
        this.visible = true
      },
      close() {
        this.visible = false
      }
    }
}
</script>

<style>

</style>