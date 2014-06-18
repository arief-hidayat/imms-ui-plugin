package com.hida.imms

import grails.util.GrailsNameUtils
import grails.util.Holders
import org.springframework.context.i18n.LocaleContextHolder

class BsTypeAheadTagLib {
    static namespace = "bs"
//    static defaultEncodeAs = [taglib: 'html']
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]


//    <input class="form-control type-ahead" id="assetInstance-assetType" data-field="assetType" data-domain="AssetType"
//    data-display-key='type' data-items='all' data-minLength='1' value="${assetInstance?.assetType}" placeholder="type ahead and select ..."/>
//    <div id="assetType-values">
//    <input type="hidden" name="assetType" data-field="type" value="${assetInstance?.assetType}">
//    </div>

    //<bs:typeAhead parentInstance="assetInstance" field="assetType" domain="AssetType" items="all" minLength="1"  value="${assetInstance?.assetType}"
    // fields="[ assetTypeId : assetInstance?.assetTypeId]" />
    def messageSource
    protected String getPlaceholder() {
        messageSource.getMessage("placeholder.typeahead.label", null, "type ahead and select ...", LocaleContextHolder.locale)
    }

    def typeAhead = {attrs ->
        out << buildTypeAheadDiv(attrs)
    }


    def displayKeyConf = Holders.config.imms?.typeahead?.displayKey ?: [:]


    private StringBuilder buildTypeAheadDiv(def attrs) {
        StringBuilder sb = new StringBuilder()
        String parentInstance = attrs.parentInstance, domain = attrs.domain, displayKey = displayKeyConf[domain],
                field = attrs.field ?: "${domain.substring(0,1).toLowerCase()}${domain.substring(1)}",
                id = attrs.id ?: ( attrs.parentInstance ? "${parentInstance}-${field}" : field)


        if(!parentInstance) { // case without parentInstance and field
            sb.append("<input class='form-control type-ahead' id='").append(id).append("' ")
            if(attrs.readonly) sb.append("readonly='readonly' ")
            sb.append("data-domain='").append(domain).append("' ")
            if(displayKey) sb.append("data-display-key='").append(displayKey).append("' ")
            if(attrs.items)  sb.append("data-items='").append(attrs.items).append("' ")
            if(attrs.minLength)  sb.append("data-minLength='").append(attrs.minLength).append("' ")
            if(attrs.value) sb.append("value='").append(attrs.value).append("' ")
            sb.append("placeholder='").append(placeholder).append("'/>")
//            sb.append("<div id='").append(field).append("-values'>")
//            sb.append("</div>")
        } else {
            def fields = attrs.fields ?: [:]
            if(!fields.containsKey(field) && attrs.value) fields.put(field, attrs.value)
            sb.append("<input class='form-control type-ahead' id='").append(id).append("' data-field='").append(field).append("' ")
            if(attrs.readonly) sb.append("readonly='readonly' ")
            sb.append("data-domain='").append(domain).append("' ")
            if(displayKey) sb.append("data-display-key='").append(displayKey).append("' ")
            if(attrs.items)  sb.append("data-items='").append(attrs.items).append("' ")
            if(attrs.minLength)  sb.append("data-minLength='").append(attrs.minLength).append("' ")
            if(attrs.value) sb.append("value='").append(attrs.value).append("' ")
            sb.append("placeholder='").append(placeholder).append("'/>")

            sb.append("<div id='").append(field).append("-values'>")
            def populatedFieldsConf = Holders.config.imms?.typeahead?.populatedFields?."${parentInstance}"?."${field}" ?: [:]
            if(!populatedFieldsConf.containsKey(field) && displayKey) {
                populatedFieldsConf.put(field, displayKey)
            }
            populatedFieldsConf.each { parentFieldNm, originalFieldNm ->
                sb.append("<input type='hidden' name='").append(parentFieldNm).append("' data-field='").append(originalFieldNm).append("' ")
                if(fields.containsKey(parentFieldNm)) sb.append("value='").append(fields[parentFieldNm]).append("' ")
                sb.append(">")
            }
            sb.append("</div>")
        }
        sb
    }

}
