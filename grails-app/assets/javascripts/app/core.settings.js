App = window.App || {};
App.options = App.options || {
    language : "en"
};

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