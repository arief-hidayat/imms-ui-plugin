<div class="col-xs-12">
    <dm:messageFromFlash flash="\${flash}"/>
    <g:hasErrors bean="\${${propertyName}}">
        <g:eachError bean="\${${propertyName}}" var="error">
            <dm:messageFromError error="\${error}"/>
        </g:eachError>
    </g:hasErrors>
</div>