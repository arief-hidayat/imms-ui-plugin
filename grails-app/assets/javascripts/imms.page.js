// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//= require imms.form.pack
//= require imms.table.form
//= require_self

(function($, Backbone, _, moment, App){
    App.view.TableFormSinglePage = App.view.AbstractTableFormSinglePage.extend({
        setReadOnlyForm : function(options) {
            this.form = new App.view.ReadOnlyForm(options);
        },
        setEditableForm : function(options) {
            this.form = new App.view.EditableForm(options);
        }
    });

    App.view.TableFormTabs = App.view.AbstractTableFormTabs.extend({
        setReadOnlyForm : function(options) {
            this.form = new App.view.ReadOnlyForm(options);
        },
        setEditableForm : function(options) {
            this.form = new App.view.EditableForm(options);
        }
    });

//    App.view.SinglePageTableFormWithEmbeddedTable = App.view.AbstractTableFormSinglePage.extend({
//        setReadOnlyForm : function(options) {
//            this.form = new App.view.ReadOnlyForm(options);
//        },
//        setEditableForm : function(options) {
//            this.form = new App.view.EditableFormWithEmbeddedTable(options);
//        }
//    });
//
//    App.view.TabbedTableFormWithEmbeddedTable = App.view.AbstractTableFormTabs.extend({
//        setReadOnlyForm : function(options) {
//            this.form = new App.view.ReadOnlyForm(options);
//        },
//        setEditableForm : function(options) {
//            this.form = new App.view.EditableFormWithEmbeddedTable(options);
//        }
//    });
})(jQuery, Backbone, _, moment, App);

