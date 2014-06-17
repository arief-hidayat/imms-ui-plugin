// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better 
// to create separate JavaScript files as needed.
//
//= require app/settings
//= require jquery
//= require dt/dataTables.ext
//= require dataTables.bootstrap
//= require imms.backbone.pack
//= require_self

(function($, Backbone, App){

    App.dataTableOptions = function($root, key, enableRowCallback, customUrl) { // key is domainName e.g. asset, but it might be customized i.e. workOrder/closed
            var tableConf = App.dt.config.table[key] || {};
        var customUrlConf = App.dt.config.customUrl[key] || customUrl || {};

        var pipelineOpt = { url : App.url + "/dataTable/" + key};
        if(customUrlConf != undefined) {
            if(customUrlConf.url != undefined) pipelineOpt.url = customUrlConf.url;
            if(customUrlConf.data != undefined) pipelineOpt.data = customUrlConf.data;
        }
        var ret = {
            "processing": true,
            "serverSide": true,
            "columns" : tableConf.columns || {},
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
        pk: "id",
        getSelectedRows : function() { return this.$el.data(App.datakey.selectedRows) },
        setSelectedRows : function(selected) {this.$el.data(App.datakey.selectedRows, selected); },
        canSelectMultipleRows : function() { return this.selectionMode == "multi"},
        canSelectRow : function() { return this.selectionMode != null},
        events: {
            "click tbody tr": "clickRow"
        },
        otherInitialization : function(opt) {
        },
        initialize: function(opt) {
            App.logDebug("init...Table");
            this.selectionMode = opt.selectionMode || "single";
            this.getRowId = opt.getRowId || this.getRowId;
            this.indexOfSelectedId = opt.indexOfSelectedId || this.indexOfSelectedId;

            this.pk = opt.pk || this.pk;

            this.setSelectedRows(opt.selectedRows || []);

            this.otherInitialization(opt);
            this.$el.dataTable( App.dataTableOptions(this.$el, this.key, this.canSelectRow(), this.getCustomUrl())); // true, enable row callback.
            this.subscribeEvt("table:row:select", function(data){
                App.logDebug("select key " + data.key + ", id " + data.rowId);
            });
            this.subscribeEvt("table:row:deselect", function(data){
                App.logDebug("deselect key " + data.key + ", id " + data.rowId);
            });

//            this.subscribeEvt("item:deleted", this.deleteRow);
//            this.subscribeEvt("item:added", this.addRow);
            // assumed this is triggered by form view after call backend to delete item.
        },
        getCustomUrl : function() {
            return undefined; // to be overridden for hasMany table
        },
        clickRow : function (ev) {
            if(!this.canSelectRow()) return;

            var row = ev.currentTarget;
            var id = this.getRowId(row);
            App.logDebug("clickRow table row#" + id);
            var selected = this.getSelectedRows();
            var index = this.indexOfSelectedId(id);
            if ( index === -1 ) {
                if(this.canSelectMultipleRows()) {
                    selected.push( id );
                } else {
                    selected = [id];
                    $(row).siblings().removeClass(App.css.selected); // remove other selected item;
                }
                this.publishEvt("table:row:select",{ rowId : id });
            } else {
                selected.splice( index, 1 );
                this.publishEvt("table:row:deselect",{ rowId : id });
            }
            $(row).toggleClass(App.css.selected);
            this.setSelectedRows(selected);
        },
        // composite key is to override this method.
        getRowId : function(row) {
            return row.id;
        },
        indexOfSelectedId : function(id) {
            var selected = this.getSelectedRows();
            return $.inArray(id, selected);
        },
        remove: function() {
            App.logDebug("destroy table");
            this.$el.DataTable().destroy();
            return App.View.prototype.remove.apply(this, arguments);
        },
        deleteRowById : function(id) {
            var index = this.indexOfSelectedId(id);
            if(index !== -1) {
                var selected = this.getSelectedRows();
                selected.splice( index, 1 );
                this.setSelectedRows(selected);
            }
        }
//        ,
//        deleteRow : function(data) {
//            var table = this.$el.DataTable();
//            // deleting item is not working
////            var $selector = this.$("#"+data.id);
////            var needToRedraw = false;
////            if($selector) {
////                table.row($selector).remove().draw(needToRedraw);
////            } else {
////                needToRedraw = true;
////            }
////            table.row($selector).remove().draw(needToRedraw);
////
//            App.logDebug("delete Row . id = "+ data.id);
//            var index = this.indexOfSelectedId(data.id);
//            if(index !== -1) {
//                this.$("#"+data.id).removeClass(App.css.selected);
//                this.getSelectedRows().splice( index, 1 );
//            }
//            App.logDebug("reload table ");
//            table.ajax.reload();
//        },
//        addRow : function(rowData) { // array of value
//            this.$el.DataTable().row.add(rowData).draw();
//        }
    });

    // incomplete implementation.
    // alternative implementation is just to combine compositePK into single id. pk1::pk2::pk3
    // make sure it contains no delimiter. --> put constraint in the
    App.view.CompositeKeyTable = App.view.Table.extend({
        indexOfSelectedId : function(id) {
            var selected = this.getSelectedRows();
            return $.inArray(id, selected);
        }
    });


    App.view.TableRegion = App.View.extend({
        // new App.view.TableRegion( el: '#asset-list', key: 'Asset' )
        tableView : null,
        events: {
            "click .buttons .btn": "clickButton"
        },
        initialize: function() {
            App.logDebug("init...TableRegion");
            this.tableView = new App.view.Table({el: this.$(".table"), key: this.key, pubSub : this.pubSub});
        },
        clickButton : function(ev) {
            var $btn = $(ev.currentTarget);
            var callback = $btn.data("callback");
            var selectedRows = this.tableView.getSelectedRows();
            if(callback != undefined && this[callback] != undefined) {
                this[callback].call(this, selectedRows);
                this.publishEvt("table:action:" + callback, {selectedRows : selectedRows});
            }
        },
        create : function(selectedRow) {
            App.logDebug("create...");
        },
        show : function(selectedRow) {
            App.logDebug("show... selectedRow:" + selectedRow);
        },
        delete : function(selectedRow) {
            App.logDebug("delete... selectedRow:" + selectedRow);
        },
        deleteRowById : function(id) {
            this.tableView.deleteRowById(id);
            this.reloadTable();
        },
        reloadTable: function() {
            this.initTable(this.tableView.getSelectedRows());
        },
        initTable : function(selectedRows) {
            if(this.tableView != null) {
                this.tableView.remove(); this.tableView = undefined;
            }
            this.tableView = new App.view.Table({el: this.$(".table"), key: this.key, pubSub : this.pubSub, selectedRows : selectedRows});
        },
        remove: function() {
            if(this.tableView != null) {
                this.tableView.remove(); this.tableView = undefined;
            }
            return App.View.prototype.remove.apply(this, arguments);
        }
    });



})(jQuery, Backbone, App);