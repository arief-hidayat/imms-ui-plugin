package com.hida.imms

import grails.converters.JSON

class ManyToManyController {
    static scope = "singleton"

    def manyToManyService
    def list(String domainName) {
        render manyToManyService.list(domainName, params) as JSON
    }
    def addItem(String domainName) {
        render manyToManyService.addItem(domainName, params) as JSON
    }
    def removeItem(String domainName) {
        render manyToManyService.removeItem(domainName, params) as JSON
    }
}
