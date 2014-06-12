<div class="row message-container" style="margin-left: 0px">
    <g:if test="\${flash.message}">
        <div class="message" role="status">\${flash.message}</div>
    </g:if>
</div>
<div class="row" style="margin-left: 0px">
    <g:form url="[resource:${propertyName}, action:'delete']" method="DELETE">
        <g:hiddenField name="version" value="\${${propertyName}?.version}"/>
        <g:hiddenField name="id" value="\${${propertyName}?.id}"/>
        <fieldset class="form">
            <g:render template="form"  model="['show' : true]"/>
        </fieldset>
        <fieldset class="buttons">
            <fieldset class="buttons">
                <g:actionSubmit data-url="\${createLink(action: 'edit')}" data-action="edit" class="btn btn-info" action="edit" value="\${message(code: 'default.button.edit.label', default: 'Edit')}"  />
                <g:actionSubmit data-url="\${createLink(action: 'delete')}" data-action="delete" class="btn btn-danger" action="delete" value="\${message(code: 'default.button.delete.label', default: 'Delete')}"
                />
            </fieldset>
        </fieldset>
    </g:form>
</div>