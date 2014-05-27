package com.hida.imms

import grails.transaction.Transactional
import grails.util.Holders
import org.grails.datastore.mapping.query.api.Criteria

@Transactional
class DataTableService {
    def grailsApplication

    static final Map<String, Class> keyClassMap = new LinkedHashMap<>()
    protected Class getClassFromKey(String key) {
        if(!keyClassMap.containsKey(key))
            keyClassMap.put(key, grailsApplication.domainClasses.find { it.clazz.simpleName == key }?.clazz)
        keyClassMap.get(key)
    }

    @Transactional(readOnly = true)
    DataTableResponse list(String key, DataTableRequest req) { // for simplicity, key is domainName
        println "list dataTable -> ${req.draw} ${req.start} ${req.length}. search : ${req.search}"
        if(req.search.value && Holders.pluginManager.hasGrailsPlugin('searchable')) {
            return listBySearchablePlugin(key, req)
        } else {
            // hibernate-search plugin?
        }
        return listByDefaultHibernatePlugin(key, req)
    }

    protected def listBySearchablePlugin(String key, DataTableRequest req) {
        DataTableResponse resp = new DataTableResponse(draw: req.draw)
        def searchOptions = [offset: req.start, max: req.length]
        Class domainClz = getClassFromKey(key)
        def searchResults = domainClz.search({
            if(req.search.value) must(queryString(req.search.value))
            for(DtReqColumn col : req.columns) {
                if(col.search.value) {
                    if(!col.search.regex) term(col.data, col.search.value) //TODO: this works only for String value.
                    else wildcard(col.data, col.search.value)
                }
            }
            // sorting not working
//            for(DtReqOrder ord : req.orders)
//                addSort(req.columns.get(ord.column).data)
        }, searchOptions)
        resp.recordsFiltered = searchResults.total
        resp.withData(searchResults.results)
        resp.recordsTotal = domainClz.count()
        resp
    }

    protected def listByDefaultHibernatePlugin(String key, DataTableRequest req) {
        DataTableResponse resp = new DataTableResponse(draw: req.draw)
        Class domainClz = getClassFromKey(key)
        Criteria criteria = domainClz.createCriteria()
        def results = criteria.list(max : req.length, offset: req.start) { //PagedResultList
            for(DtReqOrder ord : req.orders)
                order(req.columns.get(ord.column).data, ord.dir)
            for(DtReqColumn col : req.columns) {
                if(col.search.value) {
                    if(!col.search.regex) eq(col.data, col.search.value) //TODO: this works only for String value.
                    // no support for regex
                }
            }
        }
        resp.recordsFiltered = results.totalCount
        resp.withData(results.list)
        resp.recordsTotal = domainClz.count()
        resp
    }
}
