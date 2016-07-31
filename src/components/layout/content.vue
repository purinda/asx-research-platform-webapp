<template>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{ title }}
            </h1>
        </section>

        <!-- Main content -->
        <section class="content">
            <router-view keep-alive></router-view>
        </section>
        <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->
</template>

<script>
    module.exports = {
        name: 'Content',
        props: {
            title: 'Untitled'
        }
    }
</script>