<style type="text/css">
    div.company-row {
        padding-top: 20px;
    }
</style>
<template>
    <div>
        <div v-for="company in data">
            <div class="row company-row">
                <div class="col-xs-12">
                    <a class="h4" target="_blank"
                       href="http://www.asx.com.au/asx/research/company.do#!/{{ company.symbol }}">{{ company.name }}
                        ({{ company.symbol }})</a>
                    <a target="_blank" href="http://www.asx.com.au/asx/research/company.do#!/{{ company.symbol }}">ASX</a>
                    <a target="_blank" href="http://hotcopper.com.au/asx/{{ company.symbol }}">HotCopper</a>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <table class="table table-striped table-condensed table-hover table-responsive">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Pages</th>
                            <th>Published Date</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="announcement in company.announcement.data">
                            <td class="col-xs-8">{{ announcement.headline }}</td>
                            <td class="col-xs-1">{{ announcement.pages }}</td>
                            <td class="col-xs-2">{{ announcement.published_date }}</td>
                            <td class="col-xs-1"><a class="btn btn-xs btn-primary" target="_blank"
                                                    href="https://www.asx.com.au{{ announcement.url }}">PDF</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-6">
                    <img class="img-thumbnail" width="100%" v-bind:src="company.static_chart_intraday"/>
                </div>
                <div class="col-xs-6">
                    <img class="img-thumbnail" width="100%" v-bind:src="company.static_chart_7d"/>
                </div>
            </div>
        </div>
        <div v-if="!data.length">
            Sorry no companies found with recent price sensitive announcements.
        </div>
    </div>
</template>

<script>
    var SectorAnnouncementCollection = require('../../models/announcement').SectorAnnouncementCollection

    module.exports = {
        name: 'sector-charts',
        data: function () {
            return {
                data: [],
                announcementCollection: null
            }
        },
        methods: {
            forceFetch: function (sectorId) {
                this.announcementCollection = new SectorAnnouncementCollection(sectorId)
                this.announcementCollection.fetch()
            }
        },
        route: {
            activate: function (t) {
                // Fetch from the API endpoint
                this.forceFetch(this.$route.params.sector)
                this.data = this.announcementCollection.toJSON()
                this.$parent.$parent.$data.title = this.data[0].sector + ' Sector'

                t.next()
            }
        }
    }
</script>

