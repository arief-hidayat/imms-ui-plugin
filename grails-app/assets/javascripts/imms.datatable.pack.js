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

        var pipelineOpt = { url : App.url + "/dataTable/" + key};
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
    App.view.Table = App.View.extend({ // new App.view.Table( el: '#asset-list', key: 'Asset')
//        key : null, // 'Asset'
        selectionMode : null,
        getSelectedRows : function() { return this.$el.data(App.datakey.selectedRows) },
        setSelectedRows : function(selected) {this.$el.data(App.datakey.selectedRows, selected); },
        canSelectMultipleRows : function() { return this.selectionMode == "multi"},
        canSelectRow : function() { return this.selectionMode != null},
        events: {
            "click tbody tr": "clickRow"
        },
        initialize: function(opt) {
            this.selectionMode = opt.selectionMode || "single";
            this.setSelectedRows([]);
            this.$el.dataTable( App.dataTableOptions(this.$el, this.key, this.canSelectRow())); // true, enable row callback.
            this.subscribeEvt("row:select", function(data){
                App.logDebug("select key " + data.key + ", id " + data.rowId);
            });
            this.subscribeEvt("row:deselect", function(data){
                App.logDebug("deselect key " + data.key + ", id " + data.rowId);
            });
        },
        clickRow : function (ev) {
            if(!this.canSelectRow()) return;

            var row = ev.currentTarget;
            var id = row.id;
            var selected = this.getSelectedRows();
            var index = $.inArray(id, selected);
            if ( index === -1 ) {
                if(this.canSelectMultipleRows()) {
                    selected.push( id );
                } else {
                    selected = [id];
                    $(row).siblings().removeClass(App.css.selected); // remove other selected item;
                }
                this.publishEvt("row:select",{ rowId : id });
            } else {
                selected.splice( index, 1 );
                this.publishEvt("row:deselect",{ rowId : id });
            }
            $(row).toggleClass(App.css.selected);
            this.setSelectedRows(selected);
        }
    });


    App.view.TableRegion = App.View.extend({
        // new App.view.TableRegion( el: '#asset-list', key: 'Asset' )
        tableView : null,
        events: {
            "click .buttons .btn": "clickButton"
        },
        initialize: function() {
            this.tableView = new App.view.Table({el: this.$(".table"), key: this.key, pubSub : this.pubSub});
        },
        clickButton : function(ev) {
            var $btn = $(ev.currentTarget);
            var callback = $btn.data("callback");
            var selectedRows = this.tableView.getSelectedRows();
            if(callback != undefined && this[callback] != undefined) {
                this[callback].call(this, selectedRows);
                this.publishEvt("action:" + callback, {selectedRows : selectedRows});
            }
        },
        create : function(selectedRow) {
            App.logDebug("create... selectedRow:" + selectedRow);
        },
        show : function(selectedRow) {
            App.logDebug("show... selectedRow:" + selectedRow);
        },
        delete : function(selectedRow) {
            App.logDebug("delete... selectedRow:" + selectedRow);
        }
    });



})(jQuery, Backbone, App);