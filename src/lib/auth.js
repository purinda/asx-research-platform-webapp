var Cookies = require('cookies-js')

class Auth extends Backbone.Model {
    get defaults() {
        return {
            cookieName: 'token',
            token: undefined,
            authenticated: false
        }
    }

    constructor() {
        super(...arguments)
        this.determineAuth()
        this._configureAjax()
    }

    /**
     * Determine if we're authenticated based on the cookie
     */
    determineAuth() {
        var token = Cookies.get(this.get('cookieName'))

        // Fix for a bug in cookies-js:
        // https://github.com/ScottHamper/Cookies/issues/37
        if (token === 'undefined') {
            token = undefined
        }

        this.set({
            authenticated: !!token,
            token: token
        })

        if (!token) {
            return
        }

        this.trigger('authenticate', this.get('token'))
    }

    /**
     * Trigger Logout event and expire the cookie set
     */
    logout() {

        Backbone.$.ajax({
            url: appParameters.get('endpoint') + 'admin/logout',
            method: 'POST',
            processData: true,
            contentType: false,
            dataType: 'json'
        })

        Cookies.expire(this.get('cookieName'))

        this.set('token', null)
        this.set('authenticated', false)

        this.trigger('logout')
    }

    /**
     * Attempt to refresh the token using the existing token in the Cookie
     */
    attempt() {

        // No token so don't try to refresh
        if (!this.get('token')) {
            return false
        }

        var response = Backbone.$.ajax({
            url: appParameters.get('endpoint') + 'admin/refresh',
            method: 'POST',
            processData: true,
            contentType: false,
            dataType: 'json'
        })

        if (response.status == 200) {
            this.trigger('login', response.responseJSON)
        } else {
            this.trigger('failure', '')
        }

        return response.status == 200
    }

    /**
     * Trigger an authentication request to the server-side
     *
     * @param {string} email
     * @param {string} password
     */
    login(email, password) {
        var data = JSON.stringify({
            email: email,
            password: password
        })

        var response = Backbone.$.ajax({
            url: appParameters.get('endpoint') + 'admin/login',
            method: 'POST',
            processData: true,
            contentType: false,
            dataType: 'json',
            data: data
        })

        if (response.status == 200) {
            this.trigger('login', response.responseJSON)
        } else {
            this.trigger('failure', response.responseJSON)
        }

        return response.status == 200
    }

    /**
     * Embed the token in the every request
     *
     * @returns {boolean}
     * @private
     */
    _configureAjax() {
        var auth = this

        Backbone.$.ajaxSetup({
            async: false,
            beforeSend(jqXHR) {
                jqXHR.setRequestHeader('Accept', 'application/json');
                jqXHR.setRequestHeader('Content-Type', 'application/json');

                if (auth.get('authenticated')) {
                    jqXHR.setRequestHeader('Authorization', auth.get('token'))
                }

                return true
            },
            complete: function (jqXHR) {
                var token = null

                if (!this.url.match(/logout/)) {
                    if (token = jqXHR.getResponseHeader('Authorization')) {

                        auth.set({
                            token: token,
                            authenticated: true
                        })

                        Cookies.set(auth.get('cookieName'), token)
                    }
                }

                // If response was 401 logout / delete token information
                if (jqXHR.status == 401) {
                    auth.set('token', null)
                    Cookies.expire(auth.get('cookieName'))
                }
            }
        })
    }
}

var session = new Auth()
export {
    session
}