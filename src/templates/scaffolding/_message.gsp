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

<div class="col-xs-12">
    <g:if test="\${flash.info}">
        <div class="row text-info">\${flash.info}</div>
    </g:if>
    <g:if test="\${flash.warning}">
        <div class="row text-warning">\${flash.warning}</div>
    </g:if>
    <g:if test="\${flash.error}">
        <div class="row text-danger">\${flash.error}</div>
    </g:if>
    <g:if test="\${flash.message}">
        <div class="row text-info">\${flash.message}</div>
    </g:if>
    <g:hasErrors bean="\${${propertyName}}">
        <g:eachError bean="\${${propertyName}}" var="error">
            <div class="row text-danger" <g:if test="\${error in org.springframework.validation.FieldError}">data-field-id="\${error.field}"</g:if>><g:message error="\${error}"/></div>
        </g:eachError>
    </g:hasErrors>
</div>