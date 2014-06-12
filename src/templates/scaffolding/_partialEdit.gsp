<div class="row message-container" style="margin-left: 0px">
    <g:render template="message"/>
</div>
<div class="row" style="margin-left: 0px">
    <g:form id="${className}-edit-form" url="[resource:${propertyName}, action:'update']" method="PUT" <%= multiPart ? ' enctype="multipart/form-data"' : '' %>>
    <g:hiddenField name="version" value="\${${propertyName}?.version}" />
    <fieldset class="form">
        <g:render template="form"/>
    </fieldset>
    <fieldset class="buttons">
        <g:actionSubmit data-action="update" class="btn btn-success" action="update" value="\${message(code: 'default.button.update.label', default: 'Update')}" />
    </fieldset>
    </g:form>
</div>