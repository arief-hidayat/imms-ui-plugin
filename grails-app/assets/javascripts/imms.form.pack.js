// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//
//= require imms.datatable.pack
//= require imms.datepicker.pack
//= require_self

(function($, Backbone, _, moment, Bloodhound, App){

    App.view.TypeAhead = App.View.extend({
        events : {
            "change" : "onSelect"
        },
        onSelect : function() {
            var item = this.$el.data("selected-value");
            App.logDebug("on select " + item);
            if(this.$values != undefined) {
                App.logDebug("this.$values is ok ");
                this.$values.children("input").each(function(){
                    var $this = $(this);
                    App.logDebug("data-field " + $this.data("field"));
                    if($this.data("field")) {
                        var val = item ? item[$this.data("field")] : null;
                        if(val) $this.val(val);
                        else {
                            if(item) App.logErr("Warning. data not exist for field: " + $this.data("field"));
                        }
                    }
                });
            }

        },
    // <input class=".type-ahead" id="assetInstance-type" data-field="type" data-domain="assetType" data-display-key='value' data-items='all' data-minLength='2'/>
    // <div id="type-values">
//        <input type="hidden" name="typeId" data-field="id">
//        <input type="hidden" name="typeCd" data=field="code">
//        </div>
        initialize: function(opt) {
            this.field = this.$el.data("field"); // fieldName
            this.key = this.$el.data("domain"); //domain class
            this.$values = this.$el.parent().find("#"+this.field + "-values");
            this.displayKey = this.$el.data("display-key") || "value";
            this.name = opt.name || this.key;

            //http://stackoverflow.com/questions/14901535/bootstrap-typeahead-ajax-result-format-example/14959406#14959406
            //http://tatiyants.com/how-to-use-json-objects-with-twitter-bootstrap-typeahead/
            this.$el.typeahead({
                isObjectItem : true, displayKey : this.displayKey, autoSelect : false,
                remoteUrl : this.$el.data("source-url") || App.url + "/typeAhead/" + this.key,
                remoteDefaultOpts : { max : 50}
            });
        },
        remove: function() {
            if(this.$el.data('typeahead')) {
                this.$el.data('typeahead').destroy();
            }
            return Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    App.view.EditableForm = App.View.extend({
        datePickers : [],
        typeAheadFields : [],
        events : {
            "click .buttons .btn" : "doAction"
        },

        remove: function() {
            _.each(this.datePickers, function() { this.remove()});
            _.each(this.typeAheadFields, function() { this.remove()});
            return Backbone.View.prototype.remove.apply(this, arguments);
        },
        initialize: function(opt) {
            _.each(this.$(".date"), function(elem){
                var dpEl = this.$el.selector + " #" + elem.id; // so datepicker element must have ID
                this.datePickers.push(new App.view.DatePicker({ el : dpEl, pubSub : this.pubSub}));
            }, this);
            _.each(this.$(".type-ahead"), function(elem){
                var dpEl = this.$el.selector + " #" + elem.id; // so typeahead element must have ID
                this.typeAheadFields.push(new App.view.TypeAhead({ el : dpEl, pubSub : this.pubSub}));
            }, this);
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

})(jQuery, Backbone, _, moment, Bloodhound, App);

