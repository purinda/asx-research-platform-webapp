<template>
    <div class="row">
        <div class="col-sm-12 col-md-12 table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>Sector</th>
                    <th>Listed Companies</th>
                    <th>Announcements <br>(Price Sensitive)</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="sector in data">
                    <td>{{ sector.name }}</td>
                    <td>{{ sector.number_of_companies }}</td>
                    <td>{{ sector.number_of_announcements }} ({{ sector.number_of_ps_announcements }})</td>
                    <td><a class="btn btn-sm btn-primary" href="/#!/announcements/sector-charts/{{ sector.id }}">View</a></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    var SectorCollection = require('../../models/sector').SectorCollection

    // Required to be defined outside the component definition to initialise the backbone collection for component
    // to start using data structure
    var collection = new SectorCollection()

    module.exports = {
        name: 'sectors-list',
        data: function () {
            return {
                sectorCollection: collection,
                data: collection.toJSON()
            }
        },
        methods: {
            forceFetch: function () {
                return this.sectorCollection.fetch().then(function (xhr) {
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
                this.$parent.$parent.$data.title = 'Announcements Grouped By Sector'

                t.next()
            }
        }
    }
</script>

