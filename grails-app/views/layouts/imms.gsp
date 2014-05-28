<%@ page import="grails.util.Holders" %>
<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"><!--<![endif]-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title><g:layoutTitle default="Grails"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="${assetPath(src: 'favicon.ico')}" type="image/x-icon">
    <link rel="apple-touch-icon" href="${assetPath(src: 'apple-touch-icon.png')}">
    <link rel="apple-touch-icon" sizes="114x114" href="${assetPath(src: 'apple-touch-icon-retina.png')}">
    <asset:stylesheet src="application.css"/>
    <asset:javascript src="application.js"/>
    <g:layoutHead/>
</head>
<body>
<header class="navbar navbar-static-top bs-docs-nav" id="top" role="banner">
    <div class="container">
        <div class="navbar-header">
            <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="../" class="navbar-brand"><strong>IMMS</strong></a>
        </div>
        <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
            <ul class="nav navbar-nav">
                <li><a href="../asset"><span class="glyphicon glyphicon-home"></span> Home</a></li>
                <li><a href="../asset"><span class="glyphicon glyphicon-tower"></span> Asset</a></li>
                <li><a href="../inventory"><span class="glyphicon glyphicon-lock"></span> Inventory</a></li>
                <li><a href="../resource"><span class="glyphicon glyphicon-user"></span> Resource</a></li>
                <li><a href="../workorder"><span class="glyphicon glyphicon-wrench"></span> Work Order</a></li>
                <li><a href="../monitoring"><span class="glyphicon glyphicon-facetime-video"></span> Monitoring</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="../settings"><span class="glyphicon glyphicon-cog"></span> Category & Settings</a></li>
                <li><a href="#"><span class="glyphicon glyphicon-barcode"></span> User Profile</a></li>
                <li><a href="#"><span class="glyphicon glyphicon-off"></span> <strong>Log Out</strong></a></li>
            </ul>
        </nav>
    </div>
</header>
<div id="main-view" class="container">
    <g:layoutBody/>
</div>
<div class="footer" role="contentinfo"></div>
<div id="spinner" class="spinner" style="display:none;"><g:message code="spinner.alt" default="Loading&hellip;"/></div>
</body>
</html>
