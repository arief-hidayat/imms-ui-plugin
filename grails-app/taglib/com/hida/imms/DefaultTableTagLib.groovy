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
        out << buildTable(attrs)
    }


    protected String buildTable(def attrs) {
        StringBuilder sb = new StringBuilder()
        String columns = buildHeaderColumns(attrs.key)
        sb.append "<table "
        if(attrs.id) sb.append "id='${attrs.id}'"
        sb.append " class='${attrs.class ?: 'table table-striped table-bordered'}' cellspacing='0' width='${attrs.width ?: '100%'}'>"
        sb.append("<thead>").append(columns).append("</thead>").append("<tfoot>").append(columns).append("</tfoot>").append("</table>")
        sb.toString()
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

    protected String buildDropUpButtonGrp(def data) {
//        <div class="btn-group dropup">
//        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
//        <span class="glyphicon glyphicon-star"></span> Action <span class="caret"></span>
//        </button>
//  <ul class="dropdown-menu" role="menu">
//    <li><a href="#">Action</a></li>
//    <li><a href="#">Another action</a></li>
//    <li><a href="#">Something else here</a></li>
//    <li class="divider"></li>
//        <li><a href="#">Separated link</a></li>
//        </ul>
//</div>


//        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
//        <span class="glyphicon glyphicon-star"></span> Action <span class="caret"></span>
//        </button>


    }
}
