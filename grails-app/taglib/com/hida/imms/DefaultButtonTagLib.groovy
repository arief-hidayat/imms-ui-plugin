package com.hida.imms

import grails.util.GrailsNameUtils
import org.springframework.context.i18n.LocaleContextHolder

class DefaultButtonTagLib {
//    static defaultEncodeAs = [taglib: 'html']
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]
     static namespace = "bt"
    def messageSource
    protected String getMessage(String name) {
        messageSource.getMessage("action.${name}.label", null,
                GrailsNameUtils.getNaturalName(name), LocaleContextHolder.locale)
    }

    def button = { attrs, body ->
        // <bt:button id="my-id" cssClass="btn-default" icon="star">create</bt:button> --> action.create.label
        out << buildSingleButton(attrs)
    }

    def create = { attrs, body -> // <bt:create id="my-id"/>
        out << buildSingleButton([id : attrs.id, cssClass : attrs.cssClass ?: 'btn-default', icon : attrs.icon ?: 'plus', value : attrs.value ?: 'create', callback : attrs.callback ?: 'create' ])
    }
    def show = { attrs, body -> // <bt:show id="my-id"/>
        out << buildSingleButton([id : attrs.id, cssClass : attrs.cssClass ?: 'btn-default', icon : attrs.icon ?: 'zoom-in', value : attrs.value ?: 'show', callback : attrs.callback ?: 'show' ])
    }
    def edit = { attrs, body -> // <bt:edit id="my-id"/>
        out << buildSingleButton([id : attrs.id, cssClass : attrs.cssClass ?: 'btn-default', icon : attrs.icon ?: 'pencil', value : attrs.value ?: 'edit' , callback : attrs.callback ?: 'edit'])
    }
    def delete = { attrs, body -> // <bt:delete id="my-id"/>
        out << buildSingleButton([id : attrs.id, cssClass : attrs.cssClass ?: 'btn-default', icon : attrs.icon ?: 'trash', value : attrs.value ?: 'delete' , callback : attrs.callback ?: 'delete'])
    }
    def remove = { attrs, body -> // <bt:remove id="my-id"/>
        out << buildSingleButton([id : attrs.id, cssClass : attrs.cssClass ?: 'btn-default', icon : attrs.icon ?: 'remove', value : attrs.value ?: 'remove', callback : attrs.callback ?: 'remove' ])
    }
    def save = { attrs, body -> // <bt:save id="my-id"/>
        out << buildSingleButton([id : attrs.id, cssClass : attrs.cssClass ?: 'btn-default', icon : attrs.icon ?: 'save', value : attrs.value ?: 'save' , callback : attrs.callback ?: 'save'])
    }
    def update = { attrs, body -> // <bt:update id="my-id"/>
        out << buildSingleButton([id : attrs.id, cssClass : attrs.cssClass ?: 'btn-default', icon : attrs.icon ?: 'save', value : attrs.value ?: 'update' , callback : attrs.callback ?: 'update'])
    }

    protected String buildSingleButton(def btn) {
//        <button type="button" class="btn btn-default" id='my-id' data-callback="create">
//            <span class="glyphicon glyphicon-star"></span> Star
//    </button>
        StringBuilder sb = new StringBuilder()
        sb.append("<button type='button' class='btn")
        if(btn.cssClass) sb.append(" ").append(btn.cssClass)
        sb.append("' ")
        if(btn.id) sb.append("id='").append(btn.id).append("' ")
        if(btn.callback) sb.append("data-callback='").append(btn.callback).append("'")
        sb.append(">")
        if(btn.icon) sb.append("<span class='glyphicon glyphicon-").append(btn.icon).append("'></span> ")
        sb.append(getMessage(btn.value))
        sb.append("</button>")
        sb.toString()
    }

}
