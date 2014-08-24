// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//
//= require imms.datatable.pack
//= require imms.form.typeahead
//= require imms.form.datepicker
//= require_self

(function($, Backbone, _, App){
    App.template.ManyToManyItem = _.template("hello: <%= name %>"); //TODO:

    App.view.ManyToManyView = App.View.extend({
        searchView : null, searchEl : null, listEl : null,
        items : [], toRemove : [],
        readOnly : true,
        localPubSub : _.extend({},Backbone.Events),
        remove: function() {
            if(this.searchView) this.searchView.remove();
            return App.View.prototype.remove.apply(this, arguments);
        },
        initialize: function(opt) {
            this.queryListUrl = opt.queryListUrl;
            this.postItemUrl = opt.postItemUrl;
            this.searchEl = opt.searchEl;
            this.listEl = opt.listEl;
            if(opt.readOnly) this.readOnly = opt.readOnly;
            this.searchView = new App.view.TypeAhead({ el : this.searchEl, pubSub : this.localPubSub, publishSearch : true });
            this.subscribeEvt("ta:search", this.onSelectedItem);
        },
        onSelectedItem : function(item) {
            var isExist = this.isItemExist(item);
            if(isExist) {

            } else {
                this.items.push(item);
                this.renderItem(item);
            }
            this.searchView.reset();
        },
        populateItems : function() {
            this.getJSON(this.queryListUrl, {}, function(allItems) {
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
        isItemExist : function(item) {
            for(var i=0;i<this.items.length;i++) {
                if(item["id"] == this.items[i]["id"]) {
                    return true
                }
            }
            return false;
        },
        removeAllItemsFromView : function() {
            this.$(this.listEl + " .item").remove(); // TODO: make sure all item has class item
        },
        renderItem : function(item) {
            App.template.ManyToManyItem(item);
        }
    });

    App.view.ReadOnlyForm = App.View.extend({
        events : {
            "submit form" : "ignoreSubmit",
            "click .buttons .btn" : "submitForm"
        },
        remove: function() {
            return App.View.prototype.remove.apply(this, arguments);
        },
        ignoreSubmit : function() {
            App.logDebug("ignoreSubmit");
            return false;
        },
        submitForm : function(evt) {
            var $btn = $(evt.currentTarget);
            var form = this.serializeForm();
            var actionUrl = $btn.data("url") || form.action;
            App.logDebug("actionUrl " + actionUrl +", action " + $btn.data("action"));
            if($btn.data("action") && actionUrl) { // not yet tested, must alter the UI
                // e.g. <button data-action="showDialogBeforeSubmit" ... then define the customActions in App.view.TableFormTabs
                this.publishEvt("form:action:"+ $btn.data("action"),
                    { url : actionUrl, form : form});
            } else {
                App.logErr("Must set data-action and/or data-url in the button ");
            }

            return false;
        },
        serializeForm : function(form) {
            var $form = form ? $(form) : this.$("form:first"),
                formData = {}
                ;
            _($form.serializeArray()).each(function (nvp) {
                formData[nvp.name] = nvp.value;
            });
            if(!formData.action) {
                formData.action = $form.attr('action');
            }
            return formData;
        },
        initialize: function(opt) {
            this.formId = opt.formId;
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
        }
    });

})(jQuery, Backbone, _, App);

