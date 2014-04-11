var self = require("sdk/self");

var widgets;
var widget;
var module_activated = true;
 
const {Cc,Ci} = require("chrome");

function isNativeUI() {
  let appInfo = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo);
  return (appInfo.ID == "{aa3c5121-dab2-40e2-81ca-7ea25febc110}");
}


if (isNativeUI()) {
    var pageMod = require("sdk/page-mod").PageMod({
        include: ['*'],
        contentScriptWhen: 'ready',
        contentScriptFile: self.data.url('prettify.js'),
        contentScript:"prettifyDocNative(document)"
    });
}
else {
    var tabs = require("sdk/tabs").on("ready", function(tab) {
        var worker;
        try {
            if (module_activated) {
                worker = tab.attach({
                    contentScriptFile: self.data.url("prettify.js")
                });
                widget.contentURL = self.data.url("paragraph_blue.ico");
                worker.port.emit("prettifyDoc");
                widget.contentURL = self.data.url("paragraph_green.ico");
            }
        }
        catch (e) {
            var txt="There was an error on this page :" + e;
            console.log(txt);
            return;
        }
    });
}

exports.main = function() {
    if (!isNativeUI()) {
        widgets = require("sdk/widget");
        widget = widgets.Widget({
            id: "pp-icon",
            label: "Prettify Paragraphs",
            contentURL: self.data.url("paragraph_green.ico"),
            onClick: function() { 
                if (module_activated) {
                    this.contentURL = self.data.url("paragraph_red.ico");
                }
                else {
                    this.contentURL = self.data.url("paragraph_green.ico");
                }
                module_activated = !module_activated;
            }
        });
    }
};
