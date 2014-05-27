grails-app/assets

override:
javascripts/app/settings.js.

create view with imms.gsp layout. otherwise, you can create your own. use plugin example as reference.

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

taglib:
<dt:table id='asset-list' key='Asset'/>
