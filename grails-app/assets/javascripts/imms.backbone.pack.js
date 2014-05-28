// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better 
// to create separate JavaScript files as needed.
//
//= require app/settings
//= require jquery
//= require bb/underscore-min
//= require bb/backbone-min
//= require_self

var pubSub = _.extend({},Backbone.Events); //http://blog.safaribooksonline.com/2013/10/02/decoupling-backbone-applications-with-pubsub/


(function($, Backbone, _, App){
    App.View = Backbone.View.extend({
        constructor: function(opt) {
            this.key = opt.key;
            this.pubSub = opt.pubSub || window.pubSub;
            Backbone.View.apply(this,arguments);
        },
        publishEvt : function(code, data) {
            this.pubSub.trigger(code, _.extend({key : this.key}, data));
        },
        subscribeEvt : function(code, callback) {
            this.listenTo(this.pubSub, code, callback ,this);
        }
    });
})(jQuery, Backbone, _, App);

