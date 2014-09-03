package com.hida.imms

import org.codehaus.groovy.grails.orm.hibernate.cfg.CompositeIdentity
import org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsDomainBinder
import org.codehaus.groovy.grails.orm.hibernate.cfg.Mapping

class DomainClassUtil {

    static final GrailsDomainBinder DOMAIN_BINDER = new GrailsDomainBinder()

    static def getPrimaryKey(def domainClass) {
//        GrailsClass domainClz = domainClass instanceof GrailsClass ? domainClass :
//                Holders.grailsApplication.domainClasses.find { it.clazz == domainClass }

        Mapping mapping = DOMAIN_BINDER.getMapping(domainClass);
        if (mapping != null && mapping.getIdentity() instanceof CompositeIdentity) {
            CompositeIdentity identity = (CompositeIdentity) mapping.getIdentity();
            return Arrays.asList(identity.getPropertyNames())
        } else {
            ["id"]
        }
//        def identity = (domainClz.hasProperty('mapping') ? domainClz.clazz.mapping?.getMapping()?.getIdentity():null)
//        (identity.respondsTo("getPropertyNames") || identity.hasProperty("propertyNames")) ?  identity.getPropertyNames() : ["id"]
        // find alternative of : identity instanceof org.codehaus.groovy.grails.orm.hibernate.cfg.CompositeIdentity
        // to remove dependency to Hibernate plugin
    }
}
