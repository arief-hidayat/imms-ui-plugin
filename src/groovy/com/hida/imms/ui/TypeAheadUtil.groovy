package com.hida.imms.ui

/**
 * Created by arief.hidayat on 14/10/2014.
 */
class TypeAheadUtil {

    static void setupBasicAttrs(Map attrs, String domain, String displayKey,
                                String domainIdField, String domainDisplayField = displayKey) {
        attrs.items = "all"; attrs.minLength = "1";
        attrs.domain = domain; attrs.displayKey = displayKey;

        attrs.parentInstance = attrs.for ?: "ta$domain"; attrs.field = attrs.field ?: domainDisplayField;
        if(attrs.populatedFieldsConf == null) {
            attrs.populatedFieldsConf = [:]
            if(domainIdField) attrs.populatedFieldsConf.put(domainIdField, 'id')
            attrs.populatedFieldsConf.put(domainDisplayField, displayKey)
        }
        if(attrs.parentValue) {
            attrs.value = attrs.value ?: attrs.parentValue[domainDisplayField]
            if(!attrs.fields && !(attrs.populatedFieldsConf).isEmpty()) {
                def fieldData = [:]
                attrs.populatedFieldsConf.each { String fieldNm, v ->
                    fieldData[fieldNm] = attrs.parentValue[fieldNm]
                }
                attrs.fields = fieldData
            }
        }
    }
}
