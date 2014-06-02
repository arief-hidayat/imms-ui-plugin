// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//
//= require imms.datatable.pack
//= require imms.datepicker.pack
//= require_self

(function($, Backbone, _, moment, Bloodhound, App){

    App.view.TypeAhead = App.view.extend({
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
//            this.source = new Bloodhound({
//                datumTokenizer: Bloodhound.tokenizers.obj.whitespace(this.displayKey),
////                datumTokenizer: function(d) {
////                    return Bloodhound.tokenizers.whitespace(d.val);
////                },
//                queryTokenizer: Bloodhound.tokenizers.whitespace,
//                remote:  App.url + "/typeAhead/" + this.key +"?q=%QUERY"
//            });
//            if(opt.prefetch) this.source.prefetch = opt.prefetch;
//            this.source.initialize();

            //http://stackoverflow.com/questions/14901535/bootstrap-typeahead-ajax-result-format-example/14959406#14959406
            //http://tatiyants.com/how-to-use-json-objects-with-twitter-bootstrap-typeahead/
            this.$el.typeahead({
//                source: this.source.ttAdapter(),
                source: function (query, process) {
                    return $.ajax({
                        url: this.$el.data("source-url") || App.url + "/typeAhead/" + this.key,
                        type: 'post',
                        data: { query: query },
                        dataType: 'json',
                        success: function (result) {
                            return process(result);

                        }
                    });
                },
                matcher: function (obj) {
                    var item = JSON.parse(obj);
                    return ~item[this.displayKey].toLowerCase().indexOf(this.query.toLowerCase());
                },
                sorter: function (items) {
                    var beginswith = []
                        , caseSensitive = []
                        , caseInsensitive = []
                        , aItem;
                    while ((aItem = items.shift())) {
                        var item = JSON.parse(aItem);
                        if (!item[this.displayKey].toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(JSON.stringify(item));
                        else if (~item[this.displayKey].indexOf(this.query)) caseSensitive.push(JSON.stringify(item));
                        else caseInsensitive.push(JSON.stringify(item));
                    }
                    return beginswith.concat(caseSensitive, caseInsensitive);
                },
                highlighter: function (obj) {
                    var item = JSON.parse(obj);
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    return item[this.displayKey].replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                        return '<strong>' + match + '</strong>';
                    });
                },
                updater: function (obj) {
                    var item = JSON.parse(obj);
                    this.$values.children("input").each(function(){
                        var $this = $(this);
                        if($this.data("field")) {
                            var val = item ? item[$this.data("field")] : null;
                            if(val) $this.val(val);
                            else App.logErr("Warning. data not exist for field: " + $this.data("field"));
                        }
                    });
                    return item[this.displayKey];
                }
            });
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

