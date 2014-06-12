// bootstrap 3.1.1
// + datetimepicker 3.0.0 https://github.com/Eonasdan/bootstrap-datetimepicker http://eonasdan.github.io/bootstrap-datetimepicker
// + typeahead https://github.com/bassjobsen/Bootstrap-3-Typeahead
//
//
//= require app/settings
//= require jquery
//= require bootstrap3-typeahead
//= require imms.backbone.pack
//= require_self

(function($, Backbone, _, App){

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

            this.$el.attr('autocomplete', 'off');
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

})(jQuery, Backbone, _, App);

