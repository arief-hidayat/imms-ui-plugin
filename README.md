grails-app/assets

override:
javascripts/app/settings.js

js:
//= require jquery
//= require imms.backbone.pack
//= require imms.bootstrap.pack
//= require imms.datatable.pack
//= require_self

css:
*= require imms.bootstrap.pack
*= require imms.datatable.pack
*= require_self

config:

imms {
    datatable {
        rowclass = [
                Asset : { Asset item -> (item.status == "In Repair") ? "highlight" : null }

        ]
        domainkey = [
                //            Asset : ["firstKey", "secondKey"] // for composite id
        ]
        domainfields = [
                Asset : ["code", "name", "assetType", "status", "locationCd"]
        ]
    }
}
