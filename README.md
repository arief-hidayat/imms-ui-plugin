
grails-app/assets

override:
javascripts/app/settings.js.

grails install-imms-template
then generate-view and generate-controller as usual


config:

[code]
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
[/code]

taglib:
[code]
<dt:table id='asset-list' key='Asset'/>
[/code]
