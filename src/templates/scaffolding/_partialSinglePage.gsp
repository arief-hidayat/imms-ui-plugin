<%=packageName%>
${"<% int tableWidth = grails.util.Holders.config.imms?.datatable?.singlepage?.width?." + className + " ?: 6 %>"}
<div class="row" id="content-section">
    <div id="list-section" class="col-md-\${tableWidth}">%{--App.view.TableRegion--}%
        <div class="row buttons" style="margin-top: 10px">
            <div class="col-md-\${tableWidth} col-centered">
                <bt:create>&nbsp;</bt:create>
                <bt:show>&nbsp;</bt:show>
                <bt:delete>&nbsp;</bt:delete>
            </div>
        </div>
        <div class="row">
            <dt:table key='${className}'/>%{-- App.view.Table--}%
        </div>
    </div>

    <div id="detail-section" class="col-md-\${12 - tableWidth}">
        <div class="row buttons" style="margin-top: 20px">
        </div>
        <g:render template="partialCreate"/>
    </div>
</div>
</body>
</html>
