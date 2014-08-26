package com.hida.imms

import grails.transaction.Transactional

@Transactional
class ImmsUiUtilService {
    def grailsApplication

    static final Map<String, Class> keyClassMap = new LinkedHashMap<>()
    protected Class getClassFromKey(String key) {
        if(!keyClassMap.containsKey(key)) {
            // TODO: what if key is not domainName. eq. 'workOrderClosed', 'workOrderCancelled'
            keyClassMap.put(key, grailsApplication.domainClasses.find { it.clazz.simpleName == key }?.clazz)
        }
        keyClassMap.get(key)
    }
}
