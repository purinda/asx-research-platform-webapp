var User = Backbone.Model.extend({
    defaults: {
        id: null,
        name: 'Unnamed',
        email: null,
        since: ''
    }
})

export {
    User
}