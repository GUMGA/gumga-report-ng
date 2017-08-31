import GumgaReport from './gumga-report.component'
import GumgaReportProvider from './gumga-report.provider'

module.exports = angular.module('ngGumgaReport', ['gumgaReport.provider'])
    .component('gumgaReport', GumgaReport)
    