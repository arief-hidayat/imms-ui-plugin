grails install-imms-template
then generate-view and generate-controller as usual

grails-app/view
override layouts/_header.gsp

grails-app/assets
override javascripts/app/settings.js



grails-app/conf/Config.groovy:


[code]

jodatime.format.org.joda.time.LocalDate="yyyy-MM-dd"
jodatime.format.org.joda.time.LocalDateTime="yyyy-MM-dd HH:mm"

// make sure joda time plugin's date converter is used.
grails.databinding.useSpringBinder = true

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

<bs:datePicker id="assetInstance-purchaseDate" field="purchaseDate"
                           value="${assetInstance?.purchaseDate}"  readonly="${show ?: false}"></bs:datePicker>

<bs:typeAhead id="assetType" parentInstance="assetInstance" field="assetType" domain="AssetType" items="all"
minLength="1"  value="${assetInstance?.assetType}" readonly="${show ?: false}"/>
[/code]
