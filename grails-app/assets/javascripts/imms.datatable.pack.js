// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better 
// to create separate JavaScript files as needed.
//
//= require app/settings
//= require jquery
//= require jquery.dataTables.min
//= require dt/dataTables.ext
//= require dataTables.bootstrap
//= require imms.backbone.pack
//= require_self

(function($, Backbone, App){

    App.dataTableOptions = function($root, key, enableRowCallback) { // key is domainName e.g. asset, but it might be customized i.e. workOrder/closed
        var tableConf = App.dt.config.table[key];
        var customUrlConf = App.dt.config.customUrl[key];

        var pipelineOpt = { url : "dataTable/" + key};
        if(customUrlConf != undefined) {
            if(customUrlConf.url != undefined) pipelineOpt.url = customUrlConf.url;
            if(customUrlConf.data != undefined) pipelineOpt.data = customUrlConf.data;
        }
        var ret = {
            "processing": true,
            "serverSide": true,
            "columns" : tableConf.columns,
//            language: {
//                url: "/assets/localization/table/"+ App.options.language + ".json"
//            },
            "ajax": $.fn.dataTable.pipeline(pipelineOpt)
        };
        if(enableRowCallback) {
            ret.rowCallback = function( row, data ) { // make row selectable
                if ( $.inArray(""+data.DT_RowId, $root.data(App.datakey.selectedRows)) !== -1 ) { //must have row_id
                    $(row).addClass(App.css.selected);
                }
            }
        }
        if(tableConf.order != undefined) { ret.order = tableConf.order; }
        return ret;
    };

    // selectMode: 'multiple', 'single', 'none'
    App.view.MultiSelectTable = Backbone.View.extend({ // new App.view.MultiSelectTable( el: '#asset-list', key: 'Asset')
        key : null, // 'Asset'
        getSelectedRows : function() { return this.$el.data(App.datakey.selectedRows) },
        setSelectedRows : function(selected) {this.$el.data(App.datakey.selectedRows, selected); },

        events: {
            "click tbody tr": "clickRow"
        },
        initialize: function(opt) {
            this.key = opt.key;
            this.setSelectedRows([]);
            this.$el.dataTable( App.dataTableOptions(this.$el, this.key, true)); // true, enable row callback.
        },
        clickRow : function (ev) {
            var row = ev.currentTarget;
            var id = row.id;
            var selected = this.getSelectedRows();
            var index = $.inArray(id, selected);
            if ( index === -1 ) {
                selected.push( id );
            } else {
                selected.splice( index, 1 );
            }
            $(row).toggleClass(App.css.selected);
            this.setSelectedRows(selected);
        }
    });

    App.view.SingleSelectTable = Backbone.View.extend({ // new App.view.MultiSelectTable( el: '#asset-list', key: 'Asset')
        key : null, // 'Asset'
        getSelectedRows : function() { return this.$el.data(App.datakey.selectedRows) },
        setSelectedRows : function(selected) {this.$el.data(App.datakey.selectedRows, selected); },

        events: {
            "click tbody tr": "clickRow"
        },
        initialize: function(opt) {
            this.key = opt.key;
            this.setSelectedRows([]);
            this.$el.dataTable( App.dataTableOptions(this.$el, this.key, true)); // true, enable row callback.
        },
        clickRow : function (ev) {
            var row = ev.currentTarget;
            var id = row.id;
            var selected = this.getSelectedRows();
            var index = $.inArray(id, selected);
            if ( index === -1 ) {
                selected.push( id );
            } else {
                selected.splice( index, 1 );
            }
            $(row).toggleClass(App.css.selected);
            this.setSelectedRows(selected);
        }
    });


})(jQuery, Backbone, App);