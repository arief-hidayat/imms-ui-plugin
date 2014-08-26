package com.hida.imms

import grails.util.Holders
import org.springframework.context.i18n.LocaleContextHolder

class BsManyToManyTagLib {
    static namespace = "bs"
//    static defaultEncodeAs = [taglib: 'html']
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]

//    <div class='row'>
//    // type ahead here.
//    </div>
//    <div class='row'>
//    []
//    </div>
//    <bs:manyToMany
//    id="user-roles"
//    mappingClass="UserRole"
//    parentField="userId" parentId="1"
//    childField="roleId"
//    typeAheadFrom="Role" />
//    def messageSource
//    protected String getPlaceholder() {
//        messageSource.getMessage("placeholder.typeahead.label", null, "type ahead and select ...", LocaleContextHolder.locale)
//    }
    def messageSource
    protected String getTypeAheadPlaceholder() {
        messageSource.getMessage("placeholder.typeahead.add.label", null, "type ahead & select to add item ...",
                LocaleContextHolder.locale)
    }
    protected String getRemoveItemPlaceholder() {
        messageSource.getMessage("placeholder.item.remove.label", null, "Remove Selected Item(s)",
                LocaleContextHolder.locale)
    }

    def manyToMany = {attrs ->
        out << "<div id='${attrs.id}' class='many-to-many' data-mappingclass='${attrs.manyToManyClass}' data-readonly='${attrs.readonly}' data-parentfield='${attrs.parentField}' data-parentid='${attrs.parentId}' data-childfield='${attrs.childField}'>"
        out << "<div class='row' id='command-${attrs.id}'>"
        out << bs.typeAhead([ domain: attrs.typeAheadFrom, id : "search-"+attrs.id, readonly : attrs.readonly,
                              placeholder : typeAheadPlaceholder])
        out << "<button type='button' class='btn btn-danger remove-item' style='display:none;'>"
        out << removeItemPlaceholder
        out << "</button>"
        out << "</div>"
        out << "<div class='row list-item' id='list-${attrs.id}'>"
        out << "" // template of each item here. rendered dynamically
        out << "</div>"
        out << "</div>"
    }
//TODO: continue
    // currentList = [], toAdd = null, toRemove = []
    //
    // App.view.TypeAhead( { .... ,
    // onValidSelectedItem : function(item) {
    // if item in currentList --> show highlight. to select the item.
    // else --> show add button. if user click or change typeahead value, hide button.
    // },
    // ... } );


}
