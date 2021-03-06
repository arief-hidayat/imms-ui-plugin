// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//
//= require imms.datatable.pack
//= require imms.form.typeahead
//= require imms.form.datepicker
//= require select2.min
//= require_self

(function($, Backbone, _, App){
    App.template.ManyToManyItem = _.template("<div class='item col-md-2'><button type='button' class='btn btn-default' disabled='disabled'><span class='glyphicon glyphicon-ok'></span> <%= text %></button></div>");

    App.view.ManyToManyView = App.View.extend({
        searchView : null, searchEl : null, listEl : null, removeBtnEl : null,
        mappingClass : null, parentField : null, parentId : null, childField : null,
        items : [], toRemove : [],
        readOnly : true,
        localPubSub : _.extend({},Backbone.Events),
        remove: function() {
            if(this.searchView) this.searchView.remove();
            this.removeAllItemsFromView();
            return App.View.prototype.remove.apply(this, arguments);
        },
        initialize: function(opt) {
            if(opt.readOnly) this.readOnly = opt.readOnly || this.$el.data("readonly");
            this.mappingClass = opt.mappingClass || this.$el.data("mappingclass");
            this.parentField = opt.parentField || this.$el.data("parentfield"); this.parentId = opt.parentId || this.$el.data("parentid");
            this.childField = opt.childField || this.$el.data("childfield");
            this.listEl = opt.listEl || (this.$el.selector + " #" + this.$(".list-item").id);
            this.removeBtnEl = opt.removeBtnEl || (this.$el.selector + " .remove-item");
            if(!this.readOnly) {
                this.queryListUrl = opt.queryListUrl ||(App.url + '/manyToMany/list');
                this.addItemUrl = opt.addItemUrl ||(App.url + '/manyToMany/addItem');
                this.removeItemUrl = opt.removeItemUrl ||(App.url + '/manyToMany/removeItem');
                this.searchEl = opt.searchEl || (this.$el.selector + " #" + this.$(".type-ahead").id) ;
                this.searchView = new App.view.TypeAhead({ el : this.searchEl, pubSub : this.localPubSub, publishSearch : true });
                this.subscribeEvt("ta:search", this.onSelectedItem);
            }
            this.populateItems();
        },
        onRemoveItems : function() {
            this.$(this.removeBtnEl).hide();
        },
        onSelectedItem : function(item) {
            var index = this.getIndexOf(item);
            if(index >= 0) {
                //TODO: toggle selection, show delete button. hide search button
                this.$(this.listEl + " .item:eq(" + index + ")").toggleClass(".selected");
                if(this.items.length > 0) {
                    this.$(this.removeBtnEl).show();
                }
                else {
                    this.$(this.removeBtnEl).hide();
                }

            } else {
                this.items.push(item);
                this.renderItem(item);
            }
            this.searchView.reset();
        },
        populateItems : function() {
            var options = {parentField : this.parentField, parentId: this.parentId, mappingClass : this.mappingClass, childField : this.childField};
            this.getJSON(this.queryListUrl, options, function(allItems) {
                this.items = allItems || [];
                this.removeAllItemsFromView();
                for(var i=0;i<this.items.length;i++) {
                    this.renderItem(this.items[i]);
                }
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
        getJSON : function(url, option, callback) {
            return $.ajax({
                type: "GET",
                url: url,
                data: option || {},
                success: callback || function(){},
                dataType: "json",
                context : this // make sure this BB view is the context
            });
        },
        getIndexOf : function(item) {
            for(var i=0;i<this.items.length;i++) {
                if(item["id"] == this.items[i]["id"]) {
                    return i;
                }
            }
            return -1;
        },
        removeAllItemsFromView : function() {
            this.$(this.listEl + " .item").remove(); // TODO: make sure all item has class item
        },
        renderItem : function(item) {
            App.template.ManyToManyItem (item);
        }
    });

    App.view.ReadOnlyForm = App.View.extend({
        manyToManyFields : [], select2Els : [],
        events : {
            "submit form" : "ignoreSubmit",
            "click .buttons .btn" : "submitForm"
        },
        remove: function() {
            _.each(this.select2Els, function(elem){
                var $select2 = this.$(elem);
                if($select2) $select2.select2("destroy");
            }, this);
            return App.View.prototype.remove.apply(this, arguments);
        },
        ignoreSubmit : function() {
            var $btn = this.$(".buttons .btn:focus");
            if($btn && $btn.data("nojs")) {
                return true;
            }
            App.logDebug("ignoreSubmit");
            return false;
        },
        submitForm : function(evt) {
            var $btn = $(evt.currentTarget);
            $btn.attr('disabled','disabled');
            if($btn.data("nojs")) {
                var $form = $btn.closest("form");
                if($btn.data("url")) {
                    $form.attr("action", $btn.data("url"));
                }
                $form.submit();
                $btn.removeAttr('disabled');
                return false;
            }
            var form = this.serializeForm();
            if($btn.data("flag")) form._flag = $btn.data("flag");
            var actionUrl = $btn.data("url") || form.action;
            App.logDebug("actionUrl " + actionUrl +", action " + $btn.data("action"));
            if($btn.data("action") && actionUrl) { // not yet tested, must alter the UI
                // e.g. <button data-action="showDialogBeforeSubmit" ... then define the customActions in App.view.TableFormTabs
                this.publishEvt("form:action:"+ $btn.data("action"),
                    { url : actionUrl, form : form});
            } else {
                App.logErr("Must set data-action and/or data-url in the button ");
            }
            $btn.removeAttr('disabled');
            return false;
        },
        serializeForm : function(form) {
            var $form = form ? $(form) : this.$("form:first"),
                formData = {}
                ;
            _($form.serializeArray().filter(function(k) { return $.trim(k.value) != ""; })).each(function (nvp) {
                if(formData[nvp.name]) {
                    if(!$.isArray(formData[nvp.name])) {
                        var firstItem = formData[nvp.name];
                        formData[nvp.name] = [];
                        formData[nvp.name].push(firstItem);
                    }
                    formData[nvp.name].push(nvp.value);
                } else {
                    formData[nvp.name] = nvp.value;
                }
            });
            if(!formData.action) {
                formData.action = $form.attr('action');
            }
            return formData;
        },
        initialize: function(opt) {
            this.formId = opt.formId;
            this.setupSelect2(true);
            this.setupManyToManyFields(true);

            var $msgCntr = this.$(".message-container");
            if($msgCntr) {
                $msgCntr.focus();
            }
        },
        setupSelect2 : function(readOnly, parentEl) {
            var $select2Simples = parentEl == undefined ? this.$(".select2-simple") : this.$(parentEl + " .select2-simple");
            _.each($select2Simples, function(elem){
                var mmEl = this.$el.selector + " #" + elem.id; // so many-to-many element must have ID
                var $mmEl = $(mmEl);
                var isReadOnly = readOnly || ($mmEl.attr("readonly"));
                var $select2 = $mmEl.select2();
                if(isReadOnly) {
                    $select2.select2("readonly", true);
                }
                this.select2Els.push(mmEl);
            }, this);
            var $select2Remotes = parentEl == undefined ? this.$(".select2-remote") : this.$(parentEl + " .select2-remote");
            _.each($select2Remotes, function(elem){
                var mmEl = this.$el.selector + " #" + elem.id; // so many-to-many element must have ID
                var $mmEl = $(mmEl);
                var isReadOnly = readOnly || ($mmEl.attr("readonly")) || $mmEl.data("readonly");
                var domainId = $mmEl.data("id"), domainName = $mmEl.data("from"), initUrl = $mmEl.data("initurl"), dataType = $mmEl.data("datatype") || "json";
                var formatResult = App.template.select2.formatResult[$mmEl.data("resulttmpl") || domainName] || function(state) { return state.text; };
                var formatSelection = App.template.select2.formatSelection[$mmEl.data("selectiontmpl")] || formatResult;
                var multiple = $mmEl.data("multiple") == "yes";
                var select2Opts = {
                    placeholder : $mmEl.data("placeholder") || "search item",
                    minimumInputLength: 1,
                    ajax : {
                        url : App.url + "/typeAhead/" + domainName,
                        dataType : dataType,
                        data : function(term, page) { return { query: term } },
                        results : function(data, page) {
                            return { results : data };
                        }
                    },
                    multiple : multiple,
                    formatResult: formatResult, // omitted for brevity, see the source of this page
                    formatSelection: formatSelection,  // omitted for brevity, see the source of this page
                    dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
                };
                if(!multiple) {
                    select2Opts.initSelection = function(element, callback) {
                        App.logDebug("initSelection , domainId " + domainId);
                        if(domainId) {
                            App.logDebug("init debug. call " + initUrl);
                            $.ajax(initUrl, {data : {id : domainId}, dataType: dataType}).done(function(data) { callback(data); });
                        }
                    }
                }
                App.logDebug("select2 remote setup for "+ mmEl + ", initulrl:" + initUrl + ", domainId : "+ domainId);
                var $select2 = $mmEl.select2(select2Opts);
                if(multiple && domainId) {
                    var renderDataCallback = (function($mmEl){
                        return function(data) {
                            $mmEl.select2("data", data);
                        };
                    })($mmEl);
                    App.logDebug("load initial data");
                    $.ajax(initUrl, {data : {id : domainId}, dataType: dataType}).done(renderDataCallback);
                }
                if(isReadOnly) {
                    App.logDebug("make select2 readonly ");
                    $select2.select2("readonly", true);
                }
                this.select2Els.push(mmEl);
            }, this);
        },
        setupManyToManyFields : function(readOnly) {
            //might be set as deprecated
            _.each(this.$(".many-to-many"), function(elem){
                var mmEl = this.$el.selector + " #" + elem.id; // so many-to-many element must have ID
                this.manyToManyFields.push(new App.view.ManyToManyView({ el : mmEl, pubSub : this.pubSub, readOnly : readOnly}));
            }, this);

        }
    });

    App.view.EditableForm = App.view.ReadOnlyForm.extend({
        datePickers : [],
        typeAheadFields : [],
//        events : {
//            "submit form" : "ignoreSubmit",
//            "click .buttons .btn" : "submitForm"
//        },

        remove: function() {
            _.each(this.datePickers, function(view) {
                view.remove()
            });
            _.each(this.typeAheadFields, function(view) { view.remove()});
            return App.view.ReadOnlyForm.prototype.remove.apply(this, arguments);
        },
        initialize: function(opt) {
            this.formId = opt.formId;
            this.setupDatePickerFields();
            this.setupTypeAheadFields();
            this.setupSelect2(false);
            this.setupManyToManyFields(false);
        },
        setupDatePickerFields : function(parentEl) {
            var $datePickers = parentEl == undefined ? this.$(".date") : this.$(parentEl + " .date");
            _.each($datePickers, function(elem){
                var dpEl = this.$el.selector + " #" + elem.id; // so datepicker element must have ID
                this.datePickers.push(new App.view.DatePicker({ el : dpEl, pubSub : this.pubSub}));
            }, this);
        },
        setupTypeAheadFields : function(parentEl) {
            var $typeAhead = parentEl == undefined ? this.$(".type-ahead") : this.$(parentEl + " .type-ahead");
            _.each($typeAhead, function(elem){
                var dpEl = this.$el.selector + " #" + elem.id; // so typeahead element must have ID
//                App.logDebug("setup type ahead dpEl:"+ dpEl);
                this.typeAheadFields.push(new App.view.TypeAhead({ el : dpEl, pubSub : this.pubSub}));
            }, this);
        }
    });


    App.view.EditableFormWithEmbeddedTable = App.view.EditableForm.extend({
        addEmbeddedTableRow : function(tablePrefix, relativeUrl) { // #labors
            var $table = this.$(tablePrefix + "-table");
            var i = $table.find("tbody tr").length - 1;
            var newRowEl = tablePrefix + i; // this should match _shift.gsp
            var $lastRow = $table.find("tbody tr:eq("+ i +")");
            App.logDebug("add "+ tablePrefix + " row "+ i);
            this.getHtml(App.url + relativeUrl, {i : i}, function(row) {
                $lastRow.before(row);
                this.setupTypeAheadFields(newRowEl);
                this.setupDatePickerFields(newRowEl);
                this.setupSelect2(false, newRowEl);
            } );
        },
        deleteRow : function(e) {
            App.logDebug(" delete row ");
            $(e.currentTarget).closest("tr").remove();
        },
        getHtml : function(url, option, callback) {
            return $.ajax({
                type: "GET",
                url: url,
                data: option || {},
                success: callback || function(){},
                context : this // make sure this BB view is the context
            });
        }
    });

})(jQuery, Backbone, _, App);

