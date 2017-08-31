'use strict';
GumgaReportProvider.$inject = [];

function GumgaReportProvider() {

    return {
        $get: ['GumgaRest', '$http', function (GumgaRest, $http) {
            var self = this;

            self._APILocation = self._APILocation || window.APILocation
            self._token = self._token || sessionStorage.getItem('token') || localStorage.getItem('token');

            var Service = new GumgaRest(self._APILocation.apiLocation + '/api/gumgareport');
            Service.connectionLocal = self._APILocation.apiLocation + '/api/genericreport/reportconnection?gumgaToken=' + self._token;

            Service.getNew = () => {
                return $http.get(self._APILocation.apiLocation + '/api/gumgareport/new');
            }

            return Service;
        }],
        setAPILocation: function (api) {
            this._APILocation = api
        },
        getAPILocation: function (api) {
            return this._APILocation
        },
        setToken: function (token) {
            this._token = token
        },
        getToken: function (token) {
            return this._token
        }
    }
}

export default angular.module('gumgaReport.provider', []).provider('$gumgaReport', GumgaReportProvider);
