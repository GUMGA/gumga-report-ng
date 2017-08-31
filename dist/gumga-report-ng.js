/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function gumgaReports($scope, $window, gumgaController, $, $timeout, $gumgaReportProvider, $attrs) {
    var ctrl = this;

    var headerfooter = {};
    var variable = {};

    ctrl.options = ctrl.options || {
        appearance: {
            fullScreenMode: false
        },
        height: "940px"
    };

    var changeOnCreate = function changeOnCreate(designer) {
        designer.onCreateReport = function (event) {
            if (headerfooter && headerfooter.jsonReport) {
                var report = new $window.Stimulsoft.Report.StiReport();
                event.isWizardUsed = false;
                event.report = entity.data.name.definition;
                event.report.reportFile = entity.data.name;
            }
        };
    };

    var changeSaveReport = function changeSaveReport(designer) {
        designer.onSaveReport = function (event) {
            event.report.reportName = event.fileName;
            event.report.reportAlias = event.fileName;
            var jsonStr = event.report.saveToJsonString();
            ctrl.entity.data.name = event.fileName;
            ctrl.entity.data.definition = jsonStr;
            $gumgaReportProvider.save(ctrl.entity.data).then(function (response) {
                if (ctrl.onSave) {
                    ctrl.onSave({ $value: response.data.data });
                }
            });
        };
    };

    var configureOptions = function configureOptions() {
        StiOptions.WebServer.url = $gumgaReportProvider.connectionLocal;
        StiOptions.Services._databases = [];
        if (!ctrl.databases) {
            ctrl.databases = 'postgresql,mysql,oracle';
        }
        if (ctrl.databases.includes('postgresql')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiPostgreSQLDatabase());
        if (ctrl.databases.includes('mysql')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiMySqlDatabase());
        if (ctrl.databases.includes('oracle')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiOracleDatabase());
    };

    function changeOptions(opt, compare) {
        if (opt && compare) {
            Object.keys(opt).forEach(function (key) {
                if (opt[key] instanceof Object) {
                    changeOptions(opt[key], compare[key]);
                } else {
                    if (compare[key]) {
                        opt[key] = compare[key];
                    }
                }
            });
        }
    }

    $scope.configureEntity = function () {
        if (ctrl.entity) {
            configureOptions();
            var defaultOptions = new $window.Stimulsoft.Designer.StiDesignerOptions();

            changeOptions(defaultOptions, ctrl.options);

            var designer = new $window.Stimulsoft.Designer.StiDesigner(defaultOptions, 'StiDesigner', false);
            var report = new $window.Stimulsoft.Report.StiReport();
            if (ctrl.entity.data.id) {
                report.load(ctrl.entity.data.definition);
            } else {

                var database = new Stimulsoft.Report.Dictionary.StiMySqlDatabase("Security Local", "", "jdbc:mysql://localhost:3306/security?zeroDateTimeBehavior=convertToNull; user = root; password = senha;", false);
                report.dictionary.databases.clear();
                report.dictionary.databases.add(database);
                report.dictionary.synchronize();
            }

            report.dictionary.variable = variable;
            changeSaveReport(designer);
            changeOnCreate(designer);
            designer.report = report;
            designer.renderHtml('designer');
        }
    };

    $scope.init = function (value) {
        $timeout(function () {
            $gumgaReportProvider.getNew().then(function (response) {
                ctrl.entity = {};
                ctrl.entity.data = value || response.data;
                $scope.configureEntity();
            });
        }, 2000);
    };

    $scope.configureEntityViewer = function () {
        if (ctrl.entity) {
            StiOptions.WebServer.url = $gumgaReportProvider.connectionLocal;
            var viewer = new $window.Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
            var report = new $window.Stimulsoft.Report.StiReport();
            report.load(ctrl.entity.data.definition);
            viewer.report = report;
            viewer.renderHtml('viewer');
        }
    };

    $scope.initViewer = function (value) {
        $timeout(function () {
            $gumgaReportProvider.getNew().then(function (response) {
                ctrl.entity = {};
                ctrl.entity.data = value || response.data;
                $scope.configureEntityViewer();
            });
        }, 2000);
    };

    ctrl.updateReport = function (change) {
        if (ctrl.viewer) {
            $scope.initViewer(change);
        } else {
            $scope.init(change);
        }
    };

    ctrl.$onChanges = function (change) {
        if (change.viewer && change.viewer.currentValue && ctrl.entity) {
            ctrl.updateReport(ctrl.entity.data);
        }

        if (change.entity && change.entity.currentValue && change.entity.currentValue.id) {
            ctrl.updateReport(change.entity.currentValue);
        }
    };

    $scope.$watch('$ctrl.options', function (opt) {
        $scope.configureEntity();
    }, true);
}
gumgaReports.$inject = ['$scope', '$window', 'gumgaController', '$q', '$timeout', '$gumgaReport', '$attrs'];

var template = __webpack_require__(3);

var Report = {
    bindings: {
        viewer: '<?',
        entity: '<?',
        onSave: '&?',
        height: '<?',
        options: '<?',
        databases: '<?'
    },
    templateUrl: template,
    controller: gumgaReports
};

exports.default = Report;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
GumgaReportProvider.$inject = [];

function GumgaReportProvider() {

    return {
        $get: ['GumgaRest', '$http', function (GumgaRest, $http) {
            var self = this;

            self._APILocation = self._APILocation || window.APILocation;
            self._token = self._token || sessionStorage.getItem('token') || localStorage.getItem('token');

            var Service = new GumgaRest(self._APILocation.apiLocation + '/api/gumgareport');
            Service.connectionLocal = self._APILocation.apiLocation + '/api/genericreport/reportconnection?gumgaToken=' + self._token;

            Service.getNew = function () {
                return $http.get(self._APILocation.apiLocation + '/api/gumgareport/new');
            };

            return Service;
        }],
        setAPILocation: function setAPILocation(api) {
            this._APILocation = api;
        },
        getAPILocation: function getAPILocation(api) {
            return this._APILocation;
        },
        setToken: function setToken(token) {
            this._token = token;
        },
        getToken: function getToken(token) {
            return this._token;
        }
    };
}

exports.default = angular.module('gumgaReport.provider', []).provider('$gumgaReport', GumgaReportProvider);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gumgaReport = __webpack_require__(0);

var _gumgaReport2 = _interopRequireDefault(_gumgaReport);

var _gumgaReport3 = __webpack_require__(1);

var _gumgaReport4 = _interopRequireDefault(_gumgaReport3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = angular.module('ngGumgaReport', ['gumgaReport.provider']).component('gumgaReport', _gumgaReport2.default);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var path = '/gumga-report.html';
var html = "<div>\n\t<div ng-show=\"!$ctrl.viewer\">\n\t\t<div id=\"designer\"></div>\n\t</div>\n\n\t<div ng-show=\"$ctrl.viewer\">\n\t\t<div id=\"viewer\"></div>\n\t</div>\n\t<link rel=\"stylesheet\" id=\"gumga-report-stylesheet\">\n</div>";
window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ })
/******/ ]);