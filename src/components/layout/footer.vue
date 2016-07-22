<template>
    <footer class="main-footer">
        <div class="pull-right hidden-xs">
            <small>Version {{ version }}</small>
        </div>
        <strong>© 2016 <a target="_blank" href="http://nerdstorm.com.au">Nerdstorm</a></strong>
    </footer>
</template>

<script>
    module.exports = {
        data: function () {
            return {
                version: appParameters.get('version')
            }
        }
    }
</script>

