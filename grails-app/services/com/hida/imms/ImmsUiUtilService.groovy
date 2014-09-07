package com.hida.imms

import grails.transaction.Transactional
import org.codehaus.groovy.grails.commons.GrailsDomainClass

@Transactional
class ImmsUiUtilService {
    def grailsApplication

    static final Map<String, GrailsDomainClass> keyClassMap = new LinkedHashMap<>()
    protected GrailsDomainClass getClassFromKey(String key) {
        if(!keyClassMap.containsKey(key)) {
            // TODO: what if key is not domainName. eq. 'workOrderClosed', 'workOrderCancelled'
            keyClassMap.put(key, grailsApplication.domainClasses.find { it.clazz.simpleName == key })
        }
        keyClassMap.get(key)
    }
}
