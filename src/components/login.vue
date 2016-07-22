<template>
    <div class="login-box">
        <div class="login-logo">
            <a v-link="{ path: '/' }">{{ appTitle }}</a>
        </div>
        <!-- /.login-logo -->
        <div class="login-box-body">
            <p class="login-box-msg">Sign in to start your session</p>
            <form v-on:submit.prevent="login()">

                <div v-if="!success && messages != ''">
                    <div class="alert alert-danger">
                        {{ messages }}
                    </div>
                </div>

                <div v-if="success && messages != ''">
                    <div class="alert alert-success">
                        {{ messages }}
                    </div>
                </div>

                <div class="form-group has-feedback">
                    <input type="email" class="form-control" placeholder="Email" v-model="email">
                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                </div>
                <div class="form-group has-feedback">
                    <input type="password" class="form-control" placeholder="Password" v-model="password">
                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>
                <div class="row">
                    <div class="col-xs-8">
                        <div class="checkbox icheck">
                            <input type="checkbox" name="remember"> Remember my email
                        </div>
                    </div>
                    <!-- /.col -->
                    <div class="col-xs-4">
                        <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
                    </div>
                    <!-- /.col -->
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    require('icheck')
    var User = require('../models/user').User

    module.exports = {
        name: 'Login',
        data: function () {
            return {
                isAuthenticated: auth.session.get('authenticated'),
                appTitle: appParameters.get('title'),
                email: '',
                password: '',
                messages: '',
                success: false,
                body_class: 'hold-transition login-page'
            }
        },
        methods: {
            registerEvents: function () {
                // Capture the failure message from server exception
                auth.session.on('failure', function (response) {
                    this.messages = ''

                    if (response.error) {
                        this.messages = response.error.exception
                    }

                    // When no input is filled, Lumen model validation returns errors in array form
                    if (response.errors) {
                        _.each(response.errors, function (message) {
                            this.messages += message
                        }.bind(this))
                    }
                }.bind(this))

                // Capture successful login
                auth.session.on('login', function (response) {
                    this.success = true
                    this.messages = 'Authenticated successfully'

                    // Tell the container that it needs to display the dashboard as user is logged in
                    var user = new User(response.data)
                    this.$dispatch('evt-logged-in', user)
                }.bind(this))
            },

            login: function () {
                // Attempt login
                auth.session.login(this.email, this.password)
            }
        },
        ready: function () {
            this.registerEvents()

            // On ready try to use the existing token if any and login
            auth.session.attempt()

            $('input').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                increaseArea: '20%' // optional
            })
        }
    }
</script>