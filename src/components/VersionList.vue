<template>
    <v-list v-if="$store.state.versions.length > 0">
        <v-list-item :key="version.name" v-for="version in $store.state.versions">
            <v-list-item-content>{{version.name}}</v-list-item-content>
            <v-list-item-action>
                <div style="display: flex">
                    <v-btn icon>
                        <v-icon>mdi-tune</v-icon>
                    </v-btn>
                    <v-btn icon color="red">
                        <v-icon @click="() => showDeleteDialog(version.name)">mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon>mdi-play</v-icon>
                    </v-btn>
                </div>
            </v-list-item-action>
        </v-list-item>
        <CommonDialog
            width="500"
            v-model="deleteVisible"
            :content="deleteContent"
            :title="$t('DeleteConfirm')"
        >
            <v-btn text color="green" @click="() => deleteVisible = false">{{$t('Cancel')}}</v-btn>
            <v-btn text color="red" @click="handleDeleteVersion">{{$t('Confirm')}}</v-btn>
        </CommonDialog>
        <CommonSnackbar />
    </v-list>
</template>

<script>
import CommonDialog from './CommonDialog'
import { removeVersion } from '../scripts/versions'
import CommonSnackbar from './CommonSnackbar'

export default {
  components: {
    CommonDialog,
    CommonSnackbar
  },
  data: () => ({
    deleteContent: '',
    deleteVisible: false,
    deleteTarget: '',
  }),
  methods: {
    showDeleteDialog(version) {
      this.deleteContent = `${this.$t('DoYouReallyWantToDeleteThis')}(${version})`
      this.deleteVisible = true
      this.deleteTarget = version
    },
    handleDeleteVersion() {
      removeVersion(this.deleteTarget)
      this.deleteVisible = false
      this.$store.dispatch('refreshVersions')
    }
  }
}
</script>

<style scoped>
</style>