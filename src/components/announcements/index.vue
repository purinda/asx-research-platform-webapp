<template>
    <div class="row">
        <div class="col-sm-12 col-md-12">
            <v-client-table :data="data" :columns="columns" :options="tableOptions" v-ref:table></v-client-table>
        </div>
    </div>
</template>

<script>
    var AnnouncementCollection = require('../../models/announcement').AnnouncementCollection

    // Required to be defined outside the component definition to initialise the backbone collection for component
    // to start using data structure
    var collection = new AnnouncementCollection()

    module.exports = {
        name: 'announcements-list',
        data: function () {
            return {
                announcementCollection: collection,
                data: collection.toJSON(),
                columns: ['published_date', 'symbol', 'price_sensitive', 'headline', 'sector'],
                tableOptions: {
                    perPage: 100,
                    templates: {
                        view: "<a target=_blank href='http://www.asx.com.au{url}'>PDF</a>",
                    },
                    listColumns: {
                        price_sensitive: [
                            {
                                value: 1,
                                text: 'Price Sensitive'
                            },
                            {
                                value: 0,
                                text: 'Regular'
                            }
                        ]
                    }
                }
            }
        },
        methods: {
            forceFetch: function() {
                if (this.announcementCollection == null) {
                    this.announcementCollection = new AnnouncementCollection
                }

                this.announcementCollection.fetch()
            }
        },
        route: {
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Weekly Announcements'

                // Fetch from the API endpoint
                this.forceFetch()

                // Reload vue-table
                this.data = this.announcementCollection.toJSON()

                t.next()
            }
        }
    }
</script>

