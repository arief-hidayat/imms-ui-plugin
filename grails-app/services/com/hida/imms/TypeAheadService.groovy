package com.hida.imms

import grails.transaction.Transactional
import grails.util.Holders

@Transactional
class TypeAheadService {

    def typeAheadConf = Holders.config.imms?.typeahead ?: [:]
    def grailsApplication
    static final Map<String, Class> keyClassMap = new LinkedHashMap<>()
    protected Class getClassFromKey(String key) {
        if(!keyClassMap.containsKey(key))
            keyClassMap.put(key, grailsApplication.domainClasses.find { it.clazz.simpleName == key }?.clazz)
        keyClassMap.get(key)
    }

    @Transactional(readOnly = true)
    def list(String key, def params, String term) {
        def conf = typeAheadConf[key]
        Class domainClz = getClassFromKey(key)
        if(conf) {
            if(conf instanceof String) {
//                imms.typeahead.Asset = "code"
                if(term.endsWith("*")) term = term.substring(0, term.length() -1)
                return domainClz.createCriteria().list {
                    params.each { String k, String v ->
                        if(v == null) isNull(k)
                        else if (v == "") isEmpty(k)
                        else eq(k,getValue(v)) // only works for String, Long, and BigDecimal
                    }
                    like((String) conf, term + "%")
                }
            }
        } else if(Holders.pluginManager.hasGrailsPlugin("searchable")) {
            return domainClz.search(term, escape: true)
        } else {
            throw new RuntimeException("Missing configuration")
        }
    }

    protected static def getValue(String val) {
        if(val == null) return val
        if(val ==~ /\d+/) return Long.parseLong(val)
        if(val ==~ /\d+[.]\d+/) return new BigDecimal(val)
        return val
    }
}
