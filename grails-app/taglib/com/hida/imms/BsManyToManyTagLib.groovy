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
//    manyToManyClass="UserRole"
//    parent="userId" parentId="1"
//    children="roleId"
//    typeAheadFrom="Role"
//    onList="/role/list"	[id, display, url, removable]
//    onAdd="/userRole/add"
//    onRemove="/userRole/remove"/>
//    def messageSource
//    protected String getPlaceholder() {
//        messageSource.getMessage("placeholder.typeahead.label", null, "type ahead and select ...", LocaleContextHolder.locale)
//    }
    def messageSource
    protected String getTypeAheadPlaceholder() {
        messageSource.getMessage("placeholder.typeahead.add.label", null, "type ahead & select to add item ...",
                LocaleContextHolder.locale)
    }

    def manyToMany = {attrs ->
        out << "<div class='row' id='command-${attrs.id}'>"
        out << bs.typeAhead([ domain: attrs.typeAheadFrom, id : "search-"+attrs.id, readonly : attrs.readonly,
                              placeholder : typeAheadPlaceholder])
        out << "</div>"
        out << "<div class='row' id='list-${attrs.id}'>"
        out << "" // template of each item here. rendered dynamically
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
