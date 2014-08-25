package com.hida.imms

import grails.util.Holders
import org.codehaus.groovy.grails.commons.GrailsClass

class DomainClassUtil {
    static def getPrimaryKey(def domainClass) {
        GrailsClass domainClz = domainClass instanceof GrailsClass ? domainClass :
                Holders.grailsApplication.domainClasses.find { it.clazz == domainClass }
        def identity = (domainClz.hasProperty('mapping') ? domainClz.clazz.mapping?.getMapping()?.getIdentity():null)
        (identity.respondsTo("getPropertyNames") || identity.hasProperty("propertyNames")) ?  identity.getPropertyNames() : ["id"]
        // find alternative of : identity instanceof org.codehaus.groovy.grails.orm.hibernate.cfg.CompositeIdentity
        // to remove dependency to Hibernate plugin
    }
}
