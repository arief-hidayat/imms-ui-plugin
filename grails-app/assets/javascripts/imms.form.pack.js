// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//
//= require imms.datatable.pack
//= require imms.datepicker.pack
//= require_self

(function($, Backbone, _, moment, App){

    App.view.EditableForm = App.View.extend({
        datePickers : [],
        autoCompleteFields : [],
        events : {
            "click .buttons .btn" : "doAction"
        },

        remove: function() {
            _.each(this.datePickers, function() { this.remove()});
            return Backbone.View.prototype.remove.apply(this, arguments);
        },
        initialize: function(opt) {
            _.each(this.$(".date"), function(elem){
                var dpEl = this.$el.selector + " #" + elem.id; // so datepicker element must have ID
                this.datePickers.push(new App.view.DatePicker({ el : dpEl, pubSub : this.pubSub}));
            }, this);
            //TODO: setup for auto complete fields.
        },
        doAction : function(evt) {
            var $btn = $(evt.currentTarget);
            App.logDebug("doAction ");
            return false;
        }
    });


    App.view.TableFormTabs = App.View.extend({
        el : '#content-section',
        table : null, form : null,
        events : {
            "click .nav-tabs li:eq(0) a" : "buildTable",
            "click .nav-tabs li:eq(1) a" : "buildForm"
        },
        remove: function() {
            if(this.table != null) this.table.remove();
            if(this.form != null) this.form.remove();
            return Backbone.View.prototype.remove.apply(this, arguments);
        },
        initialize: function() {
            this.setupTab();
        },
        setupTab : function() {
            var $tableLi = this.$(".nav-tabs li:eq(0)"),
                $formLi = this.$(".nav-tabs li:eq(1)");
            var $tableA = $tableLi.find("a"),
                $formA = $formLi.find("a");
            this.tableEl = this.$($tableA.attr("href")); this.formEl = this.$($formA.attr("href"));
            if(this.tableEl == undefined || this.formEl == undefined) App.logErr("Please check the tab UI");
            if($tableLi.hasClass("active")) {
                $tableA.tab("show");
                this.buildTable();
            } else {
                $formA.tab("show");
                this.buildForm();
            }
        },
        buildTable : function() {
            if(this.table == undefined) this.table = new App.view.TableRegion( {el: this.tableEl, key: this.key} );
        },
        buildForm : function() {
            if(this.form == undefined) this.form = new App.view.EditableForm( {el: this.formEl, key: this.key} );
        }
    });

})(jQuery, Backbone, _, moment, App);

