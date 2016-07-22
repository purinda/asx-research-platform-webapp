<template>
    <header class="main-header">

        <!-- Logo -->
        <a v-link="{ path: '/' }" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-mini">{{ appTitle }}</span>
            <!-- logo for regular state and mobile devices -->
            <span class="logo-lg">{{ appTitle }}</span>
        </a>

        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
            <!-- Navbar Right Menu -->
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <!-- Notifications: style can be found in dropdown.less -->
                    <li class="dropdown notifications-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="fa fa-bell-o"></i>
                            <span class="label label-warning">10</span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="header">You have 10 notifications</li>
                            <li>
                                <!-- inner menu: contains the actual data -->
                                <ul class="menu">
                                    <li>
                                        <a href="#">
                                            <i class="fa fa-users text-aqua"></i> 5 new members joined today
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i class="fa fa-warning text-yellow"></i> Very long description here that
                                            may not fit into the
                                            page and may cause design problems
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i class="fa fa-users text-red"></i> 5 new members joined
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i class="fa fa-shopping-cart text-green"></i> 25 sales made
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i class="fa fa-user text-red"></i> You changed your username
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class="footer"><a href="#">View all</a></li>
                        </ul>
                    </li>
                    <!--&lt;!&ndash; User Account: style can be found in dropdown.less &ndash;&gt;-->
                    <!--<li class="dropdown user user-menu">-->
                        <!--<a href="#" class="dropdown-toggle" data-toggle="dropdown">-->
                            <!--<i class="fa fa-user"></i>-->
                            <!--<span class="hidden-xs">-->
                                <!--{{ fullname }}-->
                            <!--</span>-->
                        <!--</a>-->
                        <!--<ul class="dropdown-menu">-->
                            <!--&lt;!&ndash; User image &ndash;&gt;-->
                            <!--<li class="user-header">-->
                                <!--<i class="fa fa-5x fa-user white"></i>-->
                                <!--<div>-->
                                    <!--<strong>{{ fullname }}</strong> <br>-->
                                    <!--<small>{{ email }}</small> <br>-->
                                    <!--<small>User since {{ since }}</small>-->
                                <!--</div>-->
                            <!--</li>-->
                            <!--&lt;!&ndash; Menu Footer&ndash;&gt;-->
                            <!--<li class="user-footer">-->
                                <!--<div class="pull-right">-->
                                    <!--<a href="#" v-on:click="logout()" class="btn btn-default btn-flat">Sign out</a>-->
                                <!--</div>-->
                            <!--</li>-->
                        <!--</ul>-->
                    <!--</li>-->

                </ul>
            </div>

        </nav>
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