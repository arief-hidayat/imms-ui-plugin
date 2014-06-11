includeTargets << grailsScript("_GrailsInit")

target(InstallImmsTemplates: "Installs IMMS scaffolding template") {
    def srcdir = new File("$immsUiPluginPluginDir/src/templates/scaffolding")
    def destdir = new File("$basedir/src/templates/scaffolding/")

    if (srcdir?.isDirectory()) {
        event "StatusUpdate", ["Copying templates from $immsUiPluginPluginDir"]

        def copyTemplates = ["_form.gsp", "_message.gsp", "_partialCreate.gsp", "_partialEdit.gsp", "_partialShow.gsp",
                             "Controller.groovy", "create.gsp", "edit.gsp", "index.gsp", "show.gsp",
                             "renderEditor.template"]

        for (name in copyTemplates) {
            def srcfile = new File(srcdir, name)
            def destfile = new File(destdir, name)
            ant.copy file: srcfile.absolutePath, tofile: destfile.absolutePath, overwrite: true, failonerror: false
        }
        event "StatusFinal", ["Template installation complete"]
    } else {
        event "StatusError", ["Unable to install templates as plugin template files are missing"]
    }
}

setDefaultTarget("InstallImmsTemplates")
