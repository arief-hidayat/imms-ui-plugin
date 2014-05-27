package com.hida.imms

import grails.util.GrailsNameUtils
import grails.util.Holders
import org.springframework.context.i18n.LocaleContextHolder

class DefaultTableTagLib {
//    static defaultEncodeAs = [taglib:'none']
    static namespace = "dt"
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]
    def messageSource
    def table = { attrs, body ->
        String columns = buildHeaderColumns(attrs.key)
        out << "<table id='${attrs.id}' class='${attrs.class ?: 'table table-striped table-bordered'}' cellspacing='0' width='${attrs.width ?: '100%'}'>"
        out << "<thead>"
        out << columns
        out << "</thead>"
        out << "<tfoot>"
        out << columns
        out << "</tfoot>"
        out << "</table>"
    }

    protected String buildHeaderColumns(String domainName) {
        StringBuilder sb = new StringBuilder()
        sb.append("<tr>")
        def conf = Holders.config.imms?.datatable?.domainfields ?: [:]
        conf[domainName]?.each {
            sb.append("<td>").append(getMessage(domainName, it)).append("</td>")
        }
        sb.append("</tr>")
        sb.toString()
    }

    protected String getMessage(String domainName, String field) {
        messageSource.getMessage("${domainName}.${field}.label", null,
                GrailsNameUtils.getNaturalName(field), LocaleContextHolder.locale)
    }
}
