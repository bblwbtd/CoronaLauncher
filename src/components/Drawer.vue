<template>
    <v-navigation-drawer width="200" id='drawer' app permanent>
        <v-list>
            <v-list-item>
                <v-row no-gutters justify="center" align="center">
                    <v-col align-self="center" justify-center>
                        <v-btn block id="login" class="text--white">Login</v-btn>
                    </v-col>
                </v-row>
            </v-list-item>

            <v-list-item :key="item.title" v-for="item in items" @click="item.onclick">
                <v-list-item-icon>
                    <v-icon>
                        {{item.icon}}
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                    {{item.title}}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        title: 'Home',
                        icon: 'mdi-home',
                        onclick: () => this.switch('/')
                    },
                    {
                        title: 'Installation',
                        icon: 'mdi-cloud',
                        onclick: () => this.switch('/installation')
                    }
                ]
            }
        },
        methods: {
            switch(url) {
                this.$router.push(url)
            }
        }
    }
</script>

<style scope>
    #login {
        background-color: green;
        color: white;
    }

    #drawer {
        background-color: #272525;
    }
</style>
