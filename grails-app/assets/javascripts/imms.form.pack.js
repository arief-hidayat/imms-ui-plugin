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

