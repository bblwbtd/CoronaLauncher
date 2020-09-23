<template>
  <v-form ref="form">
      <v-text-field v-model="formData.memory" :label="$t('Memory')"></v-text-field>
      <div style="display: flex">
          <v-text-field v-model="formData.width" class="mr-1" :label="$t('width')" />
          <v-text-field v-model="formData.height" class="ml-1" :label="$t('height')" />
      </div>
      <v-text-field v-model="formData.jvmArgs" :label="$t('JVMArgument')"></v-text-field>
  </v-form>
</template>

<script>
import { getDefaultVersionConfig } from '../scripts/config'
export default {
    name: 'AdvancedConfigForm',
    props: {
        formData: {
            type: Object,
            default: getDefaultVersionConfig
        }
    },
    data: () => ({

    })
}
</script>

<style>

</style>