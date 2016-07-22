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
            forceFetch: function() {
                if (this.sectorCollection == null) {
                    this.sectorCollection = new SectorCollection
                }

                this.sectorCollection.fetch()
            }
        },
        route: {
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Announcements Grouped By Sector'

                // Fetch from the API endpoint
                this.forceFetch()

                // Reload vue-table
                this.data = this.sectorCollection.toJSON()

                t.next()
            }
        }
    }
</script>

