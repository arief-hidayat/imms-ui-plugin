App = window.App || {};
App.options = App.options || {
    language : "en"
};
App.format = App.format || {
    LocalDate : "YYYY-MM-DD", LocalDateTime : "YYYY-MM-DD HH:mm", LocalTime : "HH:mm"
};
//ref jodatime.format.org.joda.time.LocalDate and http://momentjs.com/docs #format

App.compositekeydelimiter = '_';

App.dt = App.dt || { };
App.dt.config = App.dt.config || {};

App.url = "http://localhost:8080/IMMS";

App.css = App.css || {
    selected : 'danger'
};

App.view = App.view || {};


App.datakey = App.datakey || {
    selectedRows : 'selectedRows'
};

App.logDebug = function(msg) { window.console&&console.log(msg);};
App.logErr = function(msg) { window.console&&console.error(msg);};

App.template = {};

App.template.select2  = {};
App.template.select2.formatResult  = {};