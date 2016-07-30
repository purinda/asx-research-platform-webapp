<template>
    <header class="main-header">
        <!-- Logo -->
        <a v-link="{ path: '/' }" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-mini">{{ appTitle }}</span>
            <!-- logo for regular state and mobile devices -->
            <span class="logo-lg">{{ appTitle }}</span>
        </a>
    </header>
</template>

<script>
    module.exports = {
        data: function () {
            return {
                appTitle: appParameters.get('title'),
                fullname: this.$parent.getSessionValue('user').get('name'),
                email: this.$parent.getSessionValue('user').get('email'),
                since: this.$parent.getSessionValue('user').get('since')
            }
        },
        methods: {
            logout() {
                // Capture successful logout
                auth.session.on('logout', function () {

                    // Tell the container that it needs to display the log-in page since user has logged out
                    this.$dispatch('evt-logged-out', true)
                }.bind(this))

                auth.session.logout()
            }
        }
    }
</script>