<template>
    <div v-if="!login">
        <app-header></app-header>
        <app-menu></app-menu>
        <app-content :title="title"></app-content>
        <app-footer></app-footer>
    </div>

    <div v-if="login">
        <app-login></app-login>
    </div>
</template>

<script>
    var User = require('../models/user').User

    module.exports = {
        name: 'Container',
        data: function () {
            return {
                title: 'Untitled',
                login: false,
                /**
                 * Enable after user login API is done
                 * body_class: 'hold-transition sidebar-mini login-page ', */
                body_class: 'sidebar-mini skin-black-light',
                menus: require('./../../config/menus.js') || [],

                // Session object is accessible from the child components and is a way of storing data which needs
                // to be shared across views.
                session: {
                    user: new User
                }
            }
        },
        replace: false,
        events: {
            'evt-logged-out': function() {
                this.login = true
                this.body_class = 'hold-transition skin-black-light sidebar-mini login-page'
            },
            'evt-logged-in': function(user) {
                this.login = false
                this.body_class = 'sidebar-mini skin-black-light'

                this.session.user = user
            }
        },
        methods: {
            getSessionValue: function (key) {
                return this.session[key]
            }
        },
        components: {
            'app-header': require('./layout/header.vue'),
            'app-menu': require('./layout/menu.vue'),
            'app-content': require('./layout/content.vue'),
            'app-footer': require('./layout/footer.vue'),
            'app-login': require('./login.vue')
        }
    }

</script>