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
        <li class="active"><a href="#list-section" data-toggle="tab"><span class="glyphicon glyphicon-th-list"></span> <g:message code="default.list.label" args="[entityName]" /></a></li>
        <li><a href="#detail-section" data-toggle="tab"><span class="glyphicon glyphicon-list-alt"></span> <g:message code="default.detail.label" args="[entityName]" /></a></li>
    </ul>
    <div class="tab-content">
        <div id="list-section" class="tab-pane active col-md-12"> %{--App.view.TableRegion--}%
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
        <div id="detail-section" class="tab-pane col-md-12">
            <div class="row">
                <g:if test="\${flash.message}">
                    <div class="message" role="status">\${flash.message}</div>
                </g:if>
                <g:hasErrors bean="\${${propertyName}}">
                    <ul class="errors" role="alert">
                        <g:eachError bean="\${${propertyName}}" var="error">
                            <li <g:if test="\${error in org.springframework.validation.FieldError}">data-field-id="\${error.field}"</g:if>><g:message error="\${error}"/></li>
                        </g:eachError>
                    </ul>
                </g:hasErrors>
            </div>
            <div class="row">
                <g:form id="${className}-create-form" url="[resource:${propertyName}, action:'save']" <%= multiPart ? ' enctype="multipart/form-data"' : '' %>>
                <fieldset class="form">
                    <g:render template="form"/>
                </fieldset>
                <fieldset class="buttons">
                    <g:submitButton name="create" class="btn btn-success save" value="\${message(code: 'default.button.create.label', default: 'Create')}" />
                </fieldset>
                </g:form>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" charset="utf-8">
    App.url = "\${request.contextPath}";
    jQuery(document).ready(function() {
        new App.view.TableFormTabs({ key : "${className}"});
    } );
</script>
</body>
</html>
