<template>
    <div class="row">
        <div class="col-sm-12 col-md-12">
            <v-client-table :data="data" :columns="columns" :options="tableOptions" v-ref:table></v-client-table>
        </div>
    </div>
</template>

<script>
    var TableAnnouncementCollection = require('../../models/table/table-announcement').TableAnnouncementCollection

    // Required to be defined outside the component definition to initialise the backbone collection for component
    // to start using data structure
    var collection = new TableAnnouncementCollection

    module.exports = {
        name: 'announcements-list',
        data: function () {
            return {
                announcementCollection: collection,
                data: collection.toJSON(),
                columns: ['sector', 'symbol', 'headline', 'price_sensitive', 'published_date'],
                tableOptions: {
                    perPage: 100,
                    templates: {
                        view: "<a target=_blank href='http://www.asx.com.au{url}'>PDF</a>",
                        published_date: function (row) {
                            if (moment(row.published_date).isSame(moment(), 'day')) {
                                return "<h4><span class='label label-success'>" + row.published_date + "</span></h4>"
                            } else {
                                return "<h4><span class='label label-default'>" + row.published_date + "</span></h4>"
                            }
                        }
                    },
                    listColumns: {
                        price_sensitive: [
                            {
                                value: true,
                                text: 'Yes'
                            },
                            {
                                value: false,
                                text: 'No'
                            }
                        ]
                    }
                }
            }
        },
        methods: {
            forceFetch: function () {
                return this.announcementCollection.fetch().then(function (xhr) {
                    var result = {
                        data: xhr['data']
                    }

                    return result
                }.bind(this))
            }
        },
        route: {
            waitForData: true,
            /**
             * Async data loading for filters section
             * @returns {*|Promise.<TResult>}
             */
            data: function () {
                return this.forceFetch()
            },
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Weekly Announcements'

                t.next()
            }
        }
    }
</script>

