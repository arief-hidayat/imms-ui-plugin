package com.hida.imms

import grails.transaction.Transactional

@Transactional
class ManyToManyService {
    def immsUiUtilService

    @Transactional(readOnly = true)
    def list(String key, def params) {
        //TODO:
    }
    def addItem(String key, def params) {
        //TODO:
    }
    def removeItem(String key, def params) {
        //TODO:
    }
}
