package com.hida.imms

import grails.util.Holders
import org.codehaus.groovy.grails.commons.GrailsClass
import org.codehaus.groovy.grails.orm.hibernate.cfg.CompositeIdentity

class DomainClassUtil {
    static def getPrimaryKey(def domainClass) {
        GrailsClass domainClz = domainClass instanceof GrailsClass ? domainClass :
                Holders.grailsApplication.domainClasses.find { it.clazz == domainClass }

        def identity = (domainClz.hasProperty('mapping') ? domainClz.clazz.mapping?.getMapping()?.getIdentity():null)
        identity instanceof CompositeIdentity ?  identity.getPropertyNames() : ["id"]
    }
}
