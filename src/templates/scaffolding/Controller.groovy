<%=packageName ? "package ${packageName}\n\n" : ''%>


import org.springframework.http.HttpStatus

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class ${className}Controller {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def createForm() {
        println "inside create form"
        render(model: [${propertyName}: new ${className}(params)], view: "_partialCreate")
    }
    def editForm(${className} ${propertyName}) {
        render(model: [${propertyName}: ${propertyName}], view: "_partialEdit")
    }
    def showForm(${className} ${propertyName}) {
        render(model: [${propertyName}: ${propertyName}], view: "_partialShow") //
    }

    def deleteJSON() {
        ${className} ${propertyName} = ${className}.get(params.id)
        if(${propertyName} == null) {
            renderJsonMessage(message(code: 'default.not.found.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), params.id]), params, NOT_FOUND)
            println "item not found"
            return
        }
        try {
            ${propertyName}.delete flush: true
            renderJsonMessage(message(code: 'default.deleted.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), ${propertyName}.id]), params, OK)
            println "deleted successfully"
        } catch(Exception e) {
            log.error("Failed to delete ${className}. params \${params}", e)
            renderJsonMessage(message(code: 'default.not.deleted.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), ${propertyName}.id]), params, INTERNAL_SERVER_ERROR)
            println "item couldn't be deleted"
        }
    }

    private def renderJsonMessage(String msg, def parameter, HttpStatus status) {
        render(status: status, contentType: "application/json;  charset=utf-8") {
            [message : msg, params : parameter]
        }
    }

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond new ${className}()
    }

    def show(${className} ${propertyName}) {
        if(params._partial) {
            render(model: [${propertyName}: ${propertyName}], view: "_partialShow")
            return
        }
        respond ${propertyName}
    }

    def create() {
        if(params._partial) {
            render(model: [${propertyName}: new ${className}(params)], view: "_partialCreate")
            return
        }
        respond new ${className}(params)
    }

    @Transactional
    def save(${className} ${propertyName}) {
        if (${propertyName} == null) {
            notFound()
            return
        }

        if (${propertyName}.hasErrors()) {
            if(params._partial) {
                render(model: [${propertyName}: ${propertyName}], view: "_partialCreate")
                return
            }
            respond ${propertyName}.errors, view:'create'
            return
        }



        String msg = message(code: 'default.created.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), ${propertyName}.id])
        try {
            ${propertyName}.save flush:true, failOnError: true
            if(params._partial) {
                render(model: [${propertyName}: ${propertyName}], view: "_partialShow")
                return
            }
        } catch(Exception e) {
            if(params._partial) {
                response.status = 500
                if (!${propertyName}.hasErrors()) {
                    flash.message = e.getMessage()
                }
                render(model: [${propertyName}: ${propertyName}], view: "_message")
                return
            }
        }

        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect ${propertyName}
            }
            '*' { respond ${propertyName}, [status: CREATED] }
        }
    }

    def edit(${className} ${propertyName}) {
        if(params._partial) {
            render(model: [${propertyName}: ${propertyName}], view: "_partialEdit")
            return
        }
        respond ${propertyName}
    }

    @Transactional
    def update(${className} ${propertyName}) {
        if (${propertyName} == null) {
            notFound()
            return
        }

        if (${propertyName}.hasErrors()) {
            if(params._partial) {
                render(model: [${propertyName}: ${propertyName}], view: "_partialEdit")
                return
            }
            respond ${propertyName}.errors, view:'edit'
            return
        }
        String msg = message(code: 'default.updated.message', args: [message(code: '${className}.label', default: '${className}'), ${propertyName}.id])
        try {
            ${propertyName}.save flush:true, failOnError: true
            if(params._partial) {
                render(model: [${propertyName}: ${propertyName}], view: "_partialShow")
                return
            }
        } catch(Exception e) {
            if(params._partial) {
                response.status = 500
                if (!${propertyName}.hasErrors()) {
                    flash.message = e.getMessage()
                }
                render(model: [${propertyName}: ${propertyName}], view: "_message")
                return
            }
        }

        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect ${propertyName}
            }
            '*'{ respond ${propertyName}, [status: OK] }
        }
    }

    @Transactional
    def delete(${className} ${propertyName}) {

        if (${propertyName} == null) {
            notFound()
            return
        }

        String msg = message(code: 'default.deleted.message', args: [message(code: '${className}.label', default: '${className}'), ${propertyName}.id])
        try {
            ${propertyName}.delete flush:true
            if(params._partial) {
                render(model: [${propertyName}: ${propertyName}], view: "_partialCreate")
                return
            }
        } catch(Exception e) {
            if(params._partial) {
                render(model: [${propertyName}: ${propertyName}], view: "_message")
                return
            }
        }
        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        String msg = message(code: 'default.not.found.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), params.id])
        if(params._partial) {
            render(status: NOT_FOUND, text: msg)
            return
        }
        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
