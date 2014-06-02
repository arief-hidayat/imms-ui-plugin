package com.hida.imms

import grails.converters.JSON

class TypeAheadController {

    def typeAheadService
    def list(String domainName, String q) {
        render typeAheadService.list(domainName, params, q) as JSON
    }
}
