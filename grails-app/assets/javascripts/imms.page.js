// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//= require imms.form.pack
//= require_self

(function($, Backbone, _, moment, App){

    App.view.TableFormSinglePage = App.View.extend({
        el : '#content-section', tableEl : '#list-section', formEl : '#detail-section',
        table : null, form : null,
        events : {
        },
        initialize: function(opt) {
            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            this.urlCreateForm = opt.urlCreateForm || (App.url + "/" + urlController + "/createForm/");
            this.urlShowForm = opt.urlShowForm || (App.url + "/" + urlController + "/showForm/");
            this.urlEditForm = opt.urlEditForm || (App.url + "/" + urlController + "/editForm/");
            this.urlDeleteJSON = opt.urlDeleteJSON || (App.url + "/" + urlController + "/deleteJSON/");
            this.urlDeleteConfirmationForm = opt.urlDeleteConfirmationForm; // optional
            this.initialForm = opt.initialForm || {};
            this.setupInitView( this.initialForm );
            this.otherTableActions = opt.otherTableActions || this.otherTableActions || { }; // other than show, create, delete
            this.subscribeEvt("table:action:create", this.loadForm(this.urlCreateForm));
            this.subscribeEvt("table:action:show", this.loadForm(this.urlShowForm));
            this.subscribeEvt("table:action:delete", this.deleteForm);
            this.subscribeEvt("table:action:edit", this.loadForm(this.urlEditForm)); // is this used?
            for(var customAction in this.otherTableActions) {
                if(this.otherTableActions.hasOwnProperty(customAction)) {
                    this.subscribeEvt("table:action:" + customAction, this.otherTableActions[customAction]);
                }
            }


            this.otherFormActions = opt.otherFormActions || this.otherFormActions || { }; // other than show, create, delete
            this.subscribeEvt("form:action:save", this.onSaveForm);
            this.subscribeEvt("form:action:edit", this.onEditForm);
            this.subscribeEvt("form:action:delete", this.onDeleteForm);
            this.subscribeEvt("form:action:update", this.onUpdateForm);
            for(var customAction in this.otherFormActions) {
                if(this.otherFormActions.hasOwnProperty(customAction)) {
                    this.subscribeEvt("table:action:" + customAction, this.otherFormActions[customAction]);
                }
            }
        },
        loadForm : function(url) {
            return function(eventData) {
                App.logDebug("enter loadForm from url" + url);
                var opt = {};
                if(eventData && eventData.selectedRows.length > 0) {
                    opt.id = eventData.selectedRows[0];
                } else {
                    var formId = this.getFormId();
                    if(formId) opt.id = formId;
                }
                this.getHtml(url, opt, function( data ) {
                    if(this.form != null) { this.form.remove(); this.form = undefined; }
                    $(this.formEl).html(data); // note that 'append' only work for two tabs.
                    this.buildForm();
                    this.showForm();
                });
            }
        },
        deleteForm : function(data) { // {selectedRows : selectedRows}
            var ajaxArray = [], i, len, formId = this.getFormId(), resetForm = false;
            App.logDebug("deleteForm...");

            for (i = 0, len = data.selectedRows.length; i < len; i += 1) {
                if(formId) {
                    App.logDebug("formId=" + formId + ", data.selectedRows[i]=" + data.selectedRows[i]);
                    if(formId == data.selectedRows[i]) {
                        App.logDebug("reset form...");
                        resetForm = true;
                    }
                }
                ajaxArray.push( this.postJSON(this.urlDeleteJSON, {id : data.selectedRows[i] } ));
            }

            $.when.apply(this, ajaxArray).done(function(){
                App.logDebug("rebuild table ");
                this.publishEvt("table:item:deleted", data.selectedRows);//TODO: onCreate... publish item:created
                this.buildTable();
            });
            if(resetForm) this.resetForm();
        },
        buildTable : function() {
            if(this.table == undefined) {
                this.table = new App.view.TableRegion( {el: this.tableEl, key: this.key, pubSub: this.pubSub} );
            }
            else this.table.reloadTable();
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
        },
        resetForm : function() {
            this.getHtml(this.urlCreateForm, null, function( data ) {
                if(this.form != null) { this.form.remove(); this.form = undefined; }
                $(this.formEl).html(data); // note that 'append' only work for two tabs.
                this.buildForm();
            });
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
        ajaxHtml : function(action, url, option, successCallBack, failCallback) {
            return $.ajax({
                type: action,
                url: url,
                data: option || {},
                context : this // make sure this BB view is the context
            }).done(successCallBack || function(){}).fail(failCallback || function(){});
        },
        setupInitView : function(initialForm) {
            this.buildTable();
            this.buildForm(initialForm);
        },
        getFormId : function() {
            var $formContainer = $(this.formEl);
            if($formContainer) {
                var $idField = $formContainer.find("[name='id']");
                if($idField) {
                    App.logDebug("form Id :" + $idField.val());
                    return $idField.val();
                }
            }
            return null;
        },
        showForm : function() {

        },
        showTable : function() {

        },
        onDeleteForm : function(dt){
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { action : "create"},{ id : form.id, action : "show"});
            // backend is expected to delete item and return _partialCreate
        },
        onEditForm : function(dt){
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("GET", url, form ,
                { id : form.id, action : "edit"}, { id : form.id, action : "show"});
        },
        onSaveForm : function(dt) {
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { action : "show"}, {  action : "create"});
        },
        onUpdateForm : function(dt) {
            App.logDebug("onUpdateForm ..." );
            var url = dt.url, form = dt.form;
            this.ajaxRequestForPartialView("POST", url, form ,
                { id : form.id, action : "show"}, { id : form.id, action : "update"});
        },
        ajaxRequestForPartialView : function(action, url, form, expectedForm, initialForm) {
            var successCallback = (function(expectedForm) {
                return function( data ) {
                    if(this.form != null) { this.form.remove(); this.form = undefined; }
                    $(this.formEl).html(data); // note that 'append' only work for two tabs.
                    if(expectedForm.action == "show" && !expectedForm.id) {
                        expectedForm.id = $(this.formEl).find("[name='id']").val();
                    }
                    this.buildForm(expectedForm); // pass id, action
                    this.buildTable();
                }
            })(expectedForm);
            var failCallback = (function(initialForm){
                return function(jqXHR) {
                    switch (jqXHR.status) {
                        case 404:
                        case 500:
                            this.$(".message-container").html(jqXHR.responseText); // untested
                            break;
                        default : // 412 used for save/update failed duePrecondition Failed
                            if(this.form != null) { this.form.remove(); this.form = undefined; }
                            $(this.formEl).html(jqXHR.responseText); // note that 'append' only work for two tabs.
                            if(initialForm.action == "show" && !initialForm.id) {
                                initialForm.id = $(this.formEl).find("[name='id']").val();
                            }
                            this.buildForm(initialForm); // pass id, action
                    }
                }
            })(initialForm);
            form._partial = true;
            this.ajaxHtml(action, url, form, successCallback, failCallback);
        }
    });


    // table + button action + typeAhead search
    App.view.TableWithSearchRegion = App.view.TableRegion.extend({
        otherInitialization : function(opt) {
            this.searchEl = opt.searchEl || "#search";
            this.filter = opt.filter || {};
            var urlController = this.key.charAt(0).toLowerCase() + this.key.substr(1);
            this.addUrl = App.url + "/" + urlController + "/addJSON";
        },
        initTable : function(selectedRows) {
            if(this.tableView != null) {
                this.tableView.remove(); this.tableView = undefined;
            }
            this.tableView = new App.view.CompositeKeyTable({el: this.$(".table"), key: this.key,
                filter: this.filter, pubSub : this.pubSub});
        },
        initView : function(opt) {
            this.initTable();

            this.searchView = new App.view.TypeAhead({ el : this.$(this.searchEl), pubSub : this.pubSub,
                filter : this.filter,
                onSelect : function() {
                    var item = this.$el.data("selected-value");
                    this.pubSub.publishEvt("manyToMany:add", item);
                }});
//            this.subscribeEvt("manyToMany:add", function(item){
//                this.postJSON(this.addUrl, item, function(){
//                    App.logDebug("reload table ");
//                    this.tableView.reloadTable();
//                });
//            });
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
        }
    });
    App.view.ManyToManyTableForm = App.view.TableFormSinglePage.extend({
        //TODO:
    });

    App.view.TableFormTabs = App.view.TableFormSinglePage.extend({
        events : {
            "click .nav-tabs li:eq(0) a" : "buildTable",
            "click .nav-tabs li:eq(1) a" : "buildForm"
        },
        setupInitView : function(initialForm) {
            this.tableIdx = 0;
            this.formIdx = 1;
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
        showForm : function() {
            this.showTab(this.formIdx);
        },
        showTable : function() {
            this.showTab(this.tableIdx);
        },
        showTab : function(idx) {
            this.$(".nav-tabs li:eq("+ idx +") a").tab("show");
        }
    });
})(jQuery, Backbone, _, moment, App);

