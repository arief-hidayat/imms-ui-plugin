package com.hida.imms

import grails.converters.JSON

class TypeAheadController {
    static scope = "singleton"

    def typeAheadService
    def list(String domainName, String query) {
        render typeAheadService.list(domainName, params, query) as JSON
    }
}
