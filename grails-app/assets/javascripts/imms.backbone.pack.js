// Pure backbone stuffs
//
//= require app/settings
//= require bb/underscore-min
//= require bb/backbone-min
//= require_self

var pubSub = _.extend({},Backbone.Events); //http://blog.safaribooksonline.com/2013/10/02/decoupling-backbone-applications-with-pubsub/


(function(Backbone, _, App){
    App.View = Backbone.View.extend({
        constructor: function(opt) {
            this.key = opt.key || this.key;
            this.pubSub = opt.pubSub || window.pubSub;
            Backbone.View.apply(this,arguments);
        },
        publishEvt : function(code, data) {
            App.logDebug(">>> published event = "+ code);
            this.pubSub.trigger(code, _.extend({key : this.key}, data));
        },
        subscribeEvt : function(code, callback) {
            this.listenTo(this.pubSub, code, callback ,this);
        },
        remove: function() {
//            this.$el.remove(); // this View is not removing the $el.
            this.$el.unbind(); // just unbind all event
            this.stopListening();
            return this;
        }
    });
})(Backbone, _, App);

