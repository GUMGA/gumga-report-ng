
function gumgaReports($scope, $window, gumgaController, $, $timeout, $gumgaReportProvider, $attrs) {
    let ctrl = this;

    var headerfooter = {};
    var variable = {};

    ctrl.options = ctrl.options || {
        appearance: {
            fullScreenMode: false
        },
        height: "940px"
    }

    let changeOnCreate = (designer) => {
        designer.onCreateReport = function (event) {
            if (headerfooter && headerfooter.jsonReport) {
                var report = new $window.Stimulsoft.Report.StiReport();
                event.isWizardUsed = false;
                event.report = entity.data.name.definition;
                event.report.reportFile = entity.data.name;
            }
        };
    }


    let changeSaveReport = (designer) => {
        designer.onSaveReport = function (event) {
            event.report.reportName = event.fileName;
            event.report.reportAlias = event.fileName;
            var jsonStr = event.report.saveToJsonString();
            ctrl.entity.data.name = event.fileName;
            ctrl.entity.data.definition = jsonStr;
            $gumgaReportProvider.save(ctrl.entity.data)
                .then(response => {
                    if (ctrl.onSave) {
                        ctrl.onSave({ $value: response.data.data })
                    }
                });
        };
    }

    let configureOptions = () => {
        StiOptions.WebServer.url = $gumgaReportProvider.connectionLocal;
        StiOptions.Services._databases = [];
        if (!ctrl.databases) {
            ctrl.databases = 'postgresql,mysql,oracle'
        }
        if (ctrl.databases.includes('postgresql')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiPostgreSQLDatabase());
        if (ctrl.databases.includes('mysql')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiMySqlDatabase());
        if (ctrl.databases.includes('oracle')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiOracleDatabase());
    }


    function changeOptions(opt, compare) {
        if (opt && compare) {
            Object.keys(opt).forEach(key => {
                if (opt[key] instanceof Object) {
                    changeOptions(opt[key], compare[key])
                } else {
                    if (compare[key]) {
                        opt[key] = compare[key]
                    }
                }
            })
        }
    }

    $scope.configureEntity = () => {
        if (ctrl.entity) {
            configureOptions();
            var defaultOptions = new $window.Stimulsoft.Designer.StiDesignerOptions();

            changeOptions(defaultOptions, ctrl.options)

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

    $scope.init = (value) => {
        $timeout(function() {
            $gumgaReportProvider.getNew().then(function (response) {
                ctrl.entity = {}
                ctrl.entity.data = value || response.data
                $scope.configureEntity()
            })
        },2000)
    }

    $scope.configureEntityViewer = () => {
        if (ctrl.entity) {
            StiOptions.WebServer.url = $gumgaReportProvider.connectionLocal;
            var viewer = new $window.Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
            var report = new $window.Stimulsoft.Report.StiReport();
            report.load(ctrl.entity.data.definition);
            viewer.report = report;
            viewer.renderHtml('viewer');
        }
    }

    $scope.initViewer = function (value) {
        $timeout(function() {
        $gumgaReportProvider.getNew().then(function (response) {
            ctrl.entity = {}
            ctrl.entity.data = value || response.data
            $scope.configureEntityViewer()
        })
        },2000)
    };

    ctrl.updateReport = function (change) {
        if (ctrl.viewer) {
            $scope.initViewer(change)
        } else {
            $scope.init(change)
        }
    }

    ctrl.$onChanges = function (change) {
        if (change.viewer && change.viewer.currentValue && ctrl.entity) {
            ctrl.updateReport(ctrl.entity.data)
        }

        if (change.entity && (change.entity.currentValue && change.entity.currentValue.id)) {
            ctrl.updateReport(change.entity.currentValue)
        }
    }

    $scope.$watch('$ctrl.options', opt => {
        $scope.configureEntity()
    }, true)

}
gumgaReports.$inject = ['$scope', '$window', 'gumgaController', '$q', '$timeout', '$gumgaReport', '$attrs'];

let template = require('./gumga-report.html');

const Report = {
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

export default Report;



