<%=packageName%>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="imms"/>
    <g:set var="entityName" value="\${message(code: '${domainClass.propertyName}.label', default: '${className}')}" />
    <title><g:message code="default.list.label" args="[entityName]" /></title>
</head>
<body>
<g:render template="partialSinglePage"/>
<script type="text/javascript" charset="utf-8">
    App.url = "\${request.contextPath}";
    jQuery(document).ready(function() {
        new App.view.TableFormSinglePage({ key : "${className}"});
    } );
</script>
</body>
</html>
