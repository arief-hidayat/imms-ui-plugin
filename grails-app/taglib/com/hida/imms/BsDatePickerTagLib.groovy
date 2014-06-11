package com.hida.imms

import grails.util.GrailsNameUtils
import grails.util.Holders
import org.codehaus.groovy.grails.web.taglib.exceptions.GrailsTagException
import org.joda.time.DateTime
import org.joda.time.DateTimeFieldType
import org.joda.time.LocalDate
import org.joda.time.LocalTime
import org.joda.time.ReadableInstant
import org.joda.time.ReadablePartial
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter
import org.joda.time.format.ISODateTimeFormat
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.web.servlet.support.RequestContextUtils

class BsDatePickerTagLib {
    static namespace = "bs"
//    static defaultEncodeAs = [taglib: 'html']
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]
    def messageSource
    protected String getMessage(String domainName, String field) {
        messageSource.getMessage("${domainName}.${field}.label", null,
                GrailsNameUtils.getNaturalName(field), LocaleContextHolder.locale)
    }

//    <div class="form-group">

//        <div class='input-group date' data-type="datePicker" date-after='["requestDate"]' data-field='field' data-before='["plannedEndDate","actualEndDate"]'>
//        <input type='text' id='field' class="form-control has-error" />
//        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
//        </div>
//            <div id="field-value">
        //        <input type='hidden' id='field_day' name='field_day'/>
        //        <input type='hidden' id='field_month' name='field_month'/>
        //        <input type='hidden' id='field_year' name='field_year'/>
        //    </div>
//    </div>
    // <bs:datePicker field="plannedStartDate" shouldBeAfter="requestDate" shouldBeBefore="plannedEndDate,actualEndDate" default="${LocalDate.now()}" value="${assetInstance?.plannedStartDate}"/>
    def datePicker = {attrs ->
        log.debug '***** joda:datePicker *****'
        def fields = [DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(), DateTimeFieldType.dayOfMonth()]
        out << buildDatePicker(fields, attrs, "datePicker")
    }

    def timePicker = {attrs ->
        log.debug '***** joda:timePicker *****'
        def fields = [DateTimeFieldType.hourOfDay(), DateTimeFieldType.minuteOfHour(), DateTimeFieldType.secondOfMinute()]

        out << buildDatePicker(fields, attrs, "timePicker")
    }

    def dateTimePicker = {attrs ->
        log.debug '***** joda:dateTimePicker *****'
        def fields = [DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(), DateTimeFieldType.dayOfMonth(), DateTimeFieldType.hourOfDay(), DateTimeFieldType.minuteOfHour(), DateTimeFieldType.secondOfMinute()]
        out << buildDatePicker(fields, attrs, "dateTimePicker")
    }

    protected String getValueString(def attrs, def value) {
        def locale = attrs.locale ?: RequestContextUtils.getLocale(request)
        def zone = attrs.zone
        def chronology = attrs.chronology

        def pattern = attrs.pattern
        def style = attrs.style
        if (!pattern && !style) {
            pattern = patternForType(value.getClass())
            switch (value) {
                case LocalDate:
                    style = 'M-'
                    break
                case LocalTime:
                    style = '-M'
                    break
                default:
                    style = 'MM'
            }
        }

        def formatter
        if (pattern) {
            formatter = DateTimeFormat.forPattern(pattern).withLocale(locale)
        } else {
            formatter = DateTimeFormat.forStyle(style).withLocale(locale)
        }

        if (zone) formatter = formatter.withZone(zone)
        if (chronology) formatter = formatter.withChronology(chronology)

        formatter.print(value)
    }

    private String patternForType(Class type) {
        patternForType(type.name)
    }

    private String patternForType(String type) {
        Holders.config.flatten()."jodatime.format.${type}" ?: null
    }

    protected String buildDatePicker(List fields, def attrs, String type) {
        def precision = attrs.precision ?: (Holders.config.grails?.tags?.datePicker?.default?.precision ?: 'minute')
        log.debug "precision = $precision"

        log.debug "fields = $fields"
        switch (precision) {
            case 'year': fields.remove(DateTimeFieldType.monthOfYear())
            case 'month': fields.remove(DateTimeFieldType.dayOfMonth())
            case 'day': fields.remove(DateTimeFieldType.hourOfDay())
            case 'hour': fields.remove(DateTimeFieldType.minuteOfHour())
            case 'minute': fields.remove(DateTimeFieldType.secondOfMinute())
        }
        log.debug "fields = $fields"

        def defaultValue = attrs.'default'
        if (!defaultValue) {
            defaultValue = new DateTime()
        } else if (defaultValue == 'none') {
            defaultValue = null
        } else if (defaultValue instanceof String) {
            defaultValue = getParser(fields).parseDateTime(defaultValue)
        } else if (!(defaultValue instanceof ReadableInstant) && !(defaultValue instanceof ReadablePartial)) {
            throwTagError("Tag [datePicker] requires the default date to be a parseable String or instanceof ReadableInstant or ReadablePartial")
        }
        log.debug "default = $defaultValue"

        def value = attrs.value
        if (value == 'none') {
            value = null
        } else if (!value) {
            value = defaultValue
        }
        log.debug "value = $value"

        StringBuilder sb = new StringBuilder()
        sb.append("<div class='form-group'>").append("<div class='input-group date' ")
        sb.append("data-type='").append(type).append("' ")
        if(attrs.shouldBeAfter) sb.append("data-after='").append(toArrayString(attrs.shouldBeAfter)).append("' ")
        sb.append("data-field='").append(attrs.field).append("' ")
        if(attrs.shouldBeBefore) sb.append("data-before='").append(toArrayString(attrs.shouldBeBefore)).append("' ")

        if(attrs.id) sb.append "id='${attrs.id}' "
        sb.append(">").append("<input type='text' ").append("id='").append(attrs.field).append("' class='form-control' ")
//        sb.append("' name='").append(attrs.field).append("'/>")
        if(attrs.readonly) {
            sb.append("readonly='readonly' ")
        }
        if( value && (attrs.readonly || attrs.nojs)) {
            sb.append("value='").append(getValueString(attrs, value)).append("' ")
        }
        sb.append("/>")
        String icon = type.equals("timePicker") ? "time" : "calendar"
        sb.append("<span class='input-group-addon'><span class='glyphicon glyphicon-${icon}'></span></span>")
                .append("</div>")

        sb.append("<div id='").append("${attrs.field}-value'").append("'>")
        if (fields.contains(DateTimeFieldType.dayOfMonth())) {
            sb.append("<input type='hidden' ").append("id='").append("${attrs.field}-day'").append(" name='").append("${attrs.field}_day'")
            if(attrs.value) sb.append(" value='").append(value?.dayOfMonth).append("'")
            sb.append("/>")
        }

        if (fields.contains(DateTimeFieldType.monthOfYear())) {
            sb.append("<input type='hidden' ").append("id='").append("${attrs.field}-month'").append(" name='").append("${attrs.field}_month'")
            if(attrs.value) sb.append(" value='").append(value?.monthOfYear).append("'")
            sb.append("/>")
        }

        if (fields.contains(DateTimeFieldType.year())) {
            sb.append("<input type='hidden' ").append("id='").append("${attrs.field}-year'").append(" name='").append("${attrs.field}_year'")
            if(attrs.value) sb.append(" value='").append(value?.year).append("'")
            sb.append("/>")
        }

        if (fields.contains(DateTimeFieldType.hourOfDay())) {
            sb.append("<input type='hidden' ").append("id='").append("${attrs.field}-hour'").append(" name='").append("${attrs.field}_hour'")
            if(attrs.value) sb.append(" value='").append(value?.hourOfDay).append("'")
            sb.append("/>")
        }

        if (fields.contains(DateTimeFieldType.minuteOfHour())) {
            sb.append("<input type='hidden' ").append("id='").append("${attrs.field}-minute'").append(" name='").append("${attrs.field}_minute'")
            if(attrs.value) sb.append(" value='").append(value?.minuteOfHour).append("'")
            sb.append("/>")
        }

        if (fields.contains(DateTimeFieldType.secondOfMinute())) {
            sb.append("<input type='hidden' ").append("id='").append("${attrs.field}-second'").append(" name='").append("${attrs.field}_second'")
            if(attrs.value) sb.append(" value='").append(value?.secondOfMinute).append("'")
            sb.append("/>")
        }
        sb.append("</div>")

        sb.append("</div>")
        sb.toString()
    }

    private StringBuilder toArrayString(String value) {
        String[] sp = value.split("\\w*,\\w*")
        StringBuilder sb = new StringBuilder()
        sb.append("[")
        for(int i=0;i<sp.length;i++) {
            String fieldNm = sp[i]
            sb.append("'").append(fieldNm).append("'")
            if(i < sp.length -1) sb.append(",")
        }
        sb.append("]")
        sb
    }
    private DateTimeFormatter getParser(List fields) {
        DateTimeFormatter formatter
        if (fields == [DateTimeFieldType.year()]) {
            formatter = ISODateTimeFormat.year()
        } else if (fields == [DateTimeFieldType.year(), DateTimeFieldType.monthOfYear()]) {
            formatter = ISODateTimeFormat.yearMonth()
        } else if (fields == [DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(), DateTimeFieldType.dayOfMonth()]) {
            formatter = ISODateTimeFormat.yearMonthDay()
        } else if (fields == [DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(), DateTimeFieldType.dayOfMonth(), DateTimeFieldType.hourOfDay()]) {
            formatter = ISODateTimeFormat.dateHour()
        } else if (fields == [DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(), DateTimeFieldType.dayOfMonth(), DateTimeFieldType.hourOfDay(), DateTimeFieldType.minuteOfHour()]) {
            formatter = ISODateTimeFormat.dateHourMinute()
        } else if (fields == [DateTimeFieldType.year(), DateTimeFieldType.monthOfYear(), DateTimeFieldType.dayOfMonth(), DateTimeFieldType.hourOfDay(), DateTimeFieldType.minuteOfHour(), DateTimeFieldType.secondOfMinute()]) {
            formatter = ISODateTimeFormat.dateHourMinuteSecond()
        } else if (fields == [DateTimeFieldType.hourOfDay()]) {
            formatter = ISODateTimeFormat.hour()
        } else if (fields == [DateTimeFieldType.hourOfDay(), DateTimeFieldType.minuteOfHour()]) {
            formatter = ISODateTimeFormat.hourMinute()
        } else if (fields == [DateTimeFieldType.hourOfDay(), DateTimeFieldType.minuteOfHour(), DateTimeFieldType.secondOfMinute()]) {
            formatter = ISODateTimeFormat.hourMinuteSecond()
        } else {
            throw new GrailsTagException("Invalid combination of date/time fields: $fields")
        }
        return formatter
    }

}
