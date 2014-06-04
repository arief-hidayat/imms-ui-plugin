package com.hida.imms

import grails.converters.JSON

class DataTableController {
    static scope = "singleton"

    def dataTableService

    def list(String domainName) {
        DataTableRequest req = new DataTableRequest(params)
        render dataTableService.list(domainName, req) as JSON
    }
}
