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
        respond ${propertyName}
    }

    def create() {
        respond new ${className}(params)
    }

    @Transactional
    def save(${className} ${propertyName}) {
        if (${propertyName} == null) {
            notFound()
            return
        }

        if (${propertyName}.hasErrors()) {
            respond ${propertyName}.errors, view:'create'
            return
        }

        ${propertyName}.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), ${propertyName}.id])
                redirect ${propertyName}
            }
            '*' { respond ${propertyName}, [status: CREATED] }
        }
    }

    def edit(${className} ${propertyName}) {
        respond ${propertyName}
    }

    @Transactional
    def update(${className} ${propertyName}) {
        if (${propertyName} == null) {
            notFound()
            return
        }

        if (${propertyName}.hasErrors()) {
            respond ${propertyName}.errors, view:'edit'
            return
        }

        ${propertyName}.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: '${className}.label', default: '${className}'), ${propertyName}.id])
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

        ${propertyName}.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: '${className}.label', default: '${className}'), ${propertyName}.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: '${domainClass.propertyName}.label', default: '${className}'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
