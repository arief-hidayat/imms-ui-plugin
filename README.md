Run `grails install-imms-template`
then generate-view and generate-controller as usual

grails-app/view
override layouts/_header.gsp

grails-app/assets
override javascripts/app/settings.js



grails-app/conf/Config.groovy:

* Joda-time related configurations:
    
        jodatime.format.org.joda.time.LocalDate="yyyy-MM-dd"
        
        jodatime.format.org.joda.time.LocalDateTime="yyyy-MM-dd HH:mm"
        
        grails.databinding.useSpringBinder = true


* Plugin related configurations:


        imms {
        
            datatable {

                compositekeydelimiter = '_'
            
                rowclass = [ Asset : { Asset item -> ... } ]
                
                domainkey = [
                
                        //            Asset : ["firstKey", "secondKey"] // for composite id
               
               ]
               
                domainfields = [
                
                        Asset : ["code", "name", "assetType", "status", "locationCd"]
                        
                ]
                
            }        
            
            typeahead {
            
                displayKey =  [
                
                        AssetType : "type",
                        
                        AssetGroup: "groupName"
                        
                ]
                
                populatedFields {
                
                    assetInstance = [
                    
                            assetType : [
                            
                                // field name.
                                
                                assetType : 'type' 
                                
                                // If the same as (field name - display key) and only 1, actually no need to put in.
                                
                            ],                 
        
                            assetGroup : [ : ]
                            
                    ]
                    
                }
                
            }
            
        }


taglibs:

* datatable: 

`
<dt:table id='asset-list' key='Asset'/>
`

* datepicker:

`
<bs:datePicker id="assetInstance-purchaseDate" field="purchaseDate"
                           value="${assetInstance?.purchaseDate}"  readonly="${show ?: false}"></bs:datePicker>
`

* typeahead: 

`
<bs:typeAhead id="assetType" parentInstance="assetInstance" field="assetType" domain="AssetType" items="all"
minLength="1"  value="${assetInstance?.assetType}" readonly="${show ?: false}"/>
`
