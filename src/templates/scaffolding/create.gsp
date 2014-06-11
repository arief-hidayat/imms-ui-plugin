<% import grails.persistence.Event %>
<%=packageName%>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="imms"/>
    <g:set var="entityName" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
    <title><g:message code="default.list.label" args="[entityName]" /></title>
</head>
<body>
<div class="row" id="content-section">
    <ul class="nav nav-tabs">
        <li><a href="#list-section" data-toggle="tab"><span class="glyphicon glyphicon-th-list"></span> <g:message code="default.list.label" args="[entityName]" /></a></li>
        <li  class="active"><a href="#detail-section" data-toggle="tab"><span class="glyphicon glyphicon-list-alt"></span> <g:message code="default.detail.label" args="[entityName]" /></a></li>
    </ul>
    <div class="tab-content">
        <div id="list-section" class="tab-pane col-md-12"> %{--App.view.TableRegion--}%
            <div class="row buttons" style="margin-top: 10px">
                <div class="col-md-4 col-centered">
                    <bt:create/>
                    <bt:show/>
                    <bt:delete/>
                </div>
            </div>
            <div class="row">
                <dt:table key='${className}'/>%{-- App.view.Table--}%
            </div>
        </div>
        <div id="detail-section" class="tab-pane active col-md-12">
            <g:render template="partialCreate"/>
        </div>
    </div>
</div>
<script type="text/javascript" charset="utf-8">
    var initMainTable = false;
    App.url = "\${request.contextPath}";
    jQuery(document).ready(function() {
        new App.view.TableFormTabs({ key : "${className}"});
    } );
</script>
</body>
</html>
