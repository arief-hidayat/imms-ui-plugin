package com.hida.imms

import grails.converters.JSON

class DataTableController {
    static scope = "singleton"
    def index() {}

    def dataTableService

    def list(String domainName) {
        DataTableRequest req = new DataTableRequest(params)
        println "inside dataTable/asset -> ${req.draw} ${req.start} ${req.length}. search : ${req.search}"
        render dataTableService.list(domainName, req) as JSON
    }
}
