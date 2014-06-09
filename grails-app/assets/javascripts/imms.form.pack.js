// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//
//= require imms.datatable.pack
//= require imms.datepicker.pack
//= require_self

(function($, Backbone, _, moment, App){

    App.view.TypeAhead = App.View.extend({
        events : {
            "change" : "onSelect"
        },
        onSelect : function() {
            var item = this.$el.data("selected-value");
            if(this.$values != undefined) {
                this.$values.children("input").each(function(){
                    var $this = $(this);
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
            return App.View.prototype.remove.apply(this, arguments);
        }
    });

    App.view.ReadOnlyForm = App.View.extend({
        events : {
            "click .buttons .btn" : "doAction"
        },
        doAction : function(evt) {
            var $btn = $(evt.currentTarget);
            App.logDebug("doAction " + $btn.data("action"));
                if($btn.data("action")) { // e.g. <button data-action="showDialogBeforeSubmit" ... then define the customActions in App.view.TableFormTabs
                    App.logDebug("doAction " + $btn.data("action"));
                    this.publishEvt("action:"+ $btn.data("action"), { url : $btn.data("url"), data : this.serializeForm()});
                    return false;
                }
            return true;
        },
        initialize: function(opt) {
            this.formId = opt.formId;
        }
    });

    App.view.EditableForm = App.View.extend({
        datePickers : [],
        typeAheadFields : [],
        events : {
            "click .buttons .btn" : "doAction"
        },

        remove: function() {
            _.each(this.datePickers, function(view) {
                view.remove()
            });
            _.each(this.typeAheadFields, function(view) { view.remove()});
            return App.View.prototype.remove.apply(this, arguments);
        },
        initialize: function(opt) {
            this.formId = opt.formId;
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
            if($btn.data("action")) { // e.g. <button data-action="showDialogBeforeSubmit" ... then define the customActions in App.view.TableFormTabs
                App.logDebug("doAction " + $btn.data("action"));
                this.publishEvt("action:"+ $btn.data("action"), { url : $btn.attr("href"), data : this.serializeForm()});
                return false;
            }
            return true;
        },
        serializeForm : function(form) {
            var $form = form ? $(form) : $(this.formId),
                formData = {}
                ;
            _($form.serializeArray()).each(function (nvp) {
                formData[nvp.name] = nvp.value;
            });
            return formData;
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
            if(this.table != null) {
                this.table.remove();
                this.table = undefined;
            }
            if(this.form != null) {
                this.form.remove();
                this.form = undefined;
            }
            return App.View.prototype.remove.apply(this, arguments);
        },
        initialize: function(opt) {
            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            this.urlCreateForm = opt.urlCreateForm || (App.url + "/" + urlController + "/createForm/");
            this.urlShowForm = opt.urlShowForm || (App.url + "/" + urlController + "/showForm/");
            this.urlEditForm = opt.urlEditForm || (App.url + "/" + urlController + "/editForm/");
            this.urlDeleteJSON = opt.urlDeleteJSON || (App.url + "/" + urlController + "/deleteJSON/");
            this.urlDeleteConfirmationForm = opt.urlDeleteConfirmationForm; // optional
            this.initialForm = opt.initialForm || {};
            this.setupTab( this.initialForm );
            this.customActions = opt.customActions || this.customActions || { }; // other than show, create, delete
            this.subscribeEvt("action:create", this.loadForm(this.urlCreateForm));
            this.subscribeEvt("action:show", this.loadForm(this.urlShowForm));
            this.subscribeEvt("action:delete", this.deleteForm);
            this.subscribeEvt("action:edit", this.loadForm(this.urlEditForm));
            for(var customAction in this.customActions) {
                if(this.customActions.hasOwnProperty(customAction)) {
                    this.subscribeEvt("action:" + customAction, this.customActions[customAction]);
                }
            }
        },
        loadForm : function(url, idx) {
            if(idx == undefined) idx = 1; // 2nd tab is for form.
            return function(eventData) {
                App.logDebug("enter loadForm from url" + url);
                var $formContainer = $(this.formEl);
                var opt = {};
                if(eventData.selectedRows.length > 0) {
                    opt.id = eventData.selectedRows[0];
                } else {
                    var $idField = $formContainer.first("[name='id']");
                    if($idField) opt.id = $idField.val();
                }
                this.getHtml(url, opt, function( data ) {
                    App.logDebug("loadForm to ..." + $formContainer.attr('id'));
                    if(this.form != null) { this.form.remove(); this.form = undefined; }
                    $formContainer.html(data); // note that 'append' only work for two tabs.
                    this.buildForm();
                    this.showTab(idx);
                });
            }
        },
        deleteForm : function(data) { // {selectedRows : selectedRows}
            App.logDebug("deleteForm...");
            var ajaxArray = [], i, len;
            for (i = 0, len = data.selectedRows.length; i < len; i += 1) {
                ajaxArray.push( this.postJSON(this.urlDeleteJSON, {id : data.selectedRows[i] } ));
            }

            $.when.apply(this, ajaxArray).done(function(){
                App.logDebug("rebuild table ");
                this.publishEvt("item:deleted", data.selectedRows);//TODO: onCreate... publish item:created
                this.reloadTable();
            })
        },
        reloadTable : function() {
            if(this.table != null) {
                this.table.remove(); this.table = undefined;
            }
            this.buildTable();
            this.showTab(0);
        },
        getHtml : function(url, option, callback) {
            return $.ajax({
                type: "GET",
                url: url,
                data: option || {},
                success: callback || function(){},
                context : this // make sure this BB view is the context
            });
        },
        postJSON : function(url, option, callback) {
            return $.ajax({
                type: "POST",
                url: url,
                data: option || {},
                success: callback || function(){},
                dataType: "json",
                context : this // make sure this BB view is the context
            });
        },
        setupTab : function(initialForm) {
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
                this.buildForm(initialForm);
            }
        },
        showTab : function(idx) {
            this.$(".nav-tabs li:eq("+ idx +") a").tab("show");
        },
        buildTable : function() {
            if(this.table == undefined) this.table = new App.view.TableRegion( {el: this.tableEl, key: this.key, pubSub: this.pubSub} );
        },
        buildForm : function(initialForm) {
            if(this.form == undefined) {
                var options = {el: this.formEl, key: this.key, pubSub: this.pubSub};
                if(initialForm) {
                    if(initialForm.id) options.formId = initialForm.id;
                    if(initialForm.action == "show") {
                        this.form = new App.view.ReadOnlyForm(options);
                        return;
                    }
                }
                this.form = new App.view.EditableForm(options );
            }
        }
    });
})(jQuery, Backbone, _, moment, App);

