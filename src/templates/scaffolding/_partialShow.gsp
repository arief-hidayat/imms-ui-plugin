<div class="row">
    <g:if test="\${flash.message}">
        <div class="message" role="status">\${flash.message}</div>
    </g:if>
</div>
<div class="row">
    <g:form url="[resource:${propertyName}, action:'delete']" method="DELETE">
        <g:hiddenField name="version" value="\${${propertyName}?.version}"/>
        <g:hiddenField name="id" value="\${${propertyName}?.id}"/>
        <fieldset class="form">
            <g:render template="form"  model="['show' : true]"/>
        </fieldset>
        <fieldset class="buttons">
            <fieldset class="buttons">
                <g:actionSubmit class="btn btn-info" action="edit" value="\${message(code: 'default.button.edit.label', default: 'Edit')}"  />
                <g:actionSubmit class="btn btn-danger" action="delete" value="\${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('\${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
            </fieldset>
        </fieldset>
    </g:form>
</div>