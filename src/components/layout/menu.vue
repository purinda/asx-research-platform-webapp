<template>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
        <!-- sidebar: style can be found in sidebar.less -->
        <section class="sidebar">
            <!-- search form -->
            <form action="#" method="get" class="sidebar-form">
                <div class="input-group">
                    <input type="text" name="q" class="form-control" placeholder="Search."/>
                  <span class="input-group-btn">
                    <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button>
                  </span>
                </div>
            </form>

            <!-- /.search form -->
            <!-- sidebar menu: : style can be found in sidebar.less -->
            <ul class="sidebar-menu">
                <li class="header">MAIN NAVIGATION</li>
                <li class="treeview" v-for="menu in menus">
                    <a v-link="{ path: menu.link }">
                        <i class="fa {{ menu.icon }}"></i>
                        <span>{{ menu.name }}</span>
                        <i v-show="isDefined(menu.child)" class="fa fa-angle-left pull-right"></i>
                    </a>

                    <ul v-show="isDefined(menu.child)" class="treeview-menu">
                        <li v-for="childMenu in menu.child">
                            <a v-link="{ path: childMenu.link }">
                                <i class="fa {{ childMenu.icon }}"></i> {{ childMenu.name }}
                            </a>
                        </li>
                    </ul>

                </li>

            </ul>
        </section>
        <!-- /.sidebar -->
    </aside>

</template>

<script>
    module.exports = {
        name: 'Menu',
        data: function () {
            return {
                menus: this.$parent.$data.menus || []
            }
        },
        methods: {
            isDefined: function (item) {
                return !_.isUndefined(item)
            }
        }
    }
</script>