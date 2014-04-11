function prettifyText(str, lang) {
    //str = str.replace(/(\s*)\.\.\./g,"… ");
    str = str.replace(/(\s*)([,\.])(\s*)([^0-9])/g,"$2 $4");
    if (lang == 'fr') {
        str = str.replace(/(\s*)([;:\?\!\u00BB])(\s*)/g,"\u202F$2 ");
    }
    else {
        str = str.replace(/(\s*)([;:\?\!\u00BB])(\s*)/g,"$2 ");
    }
    str = str.replace(/'/g,"\u02BC"); // MODIFIER LETTER APOSTROPHE
    return str;
}

function replaceNodeByChilds(node, f) {
    var parent = node.parentNode;
    while (f.firstChild != null) {
        parent.insertBefore(f.firstChild, node);
    }
    parent.removeChild(node);
}

function recursiveWalk(doc, node) {
    if (node) {
        node = node.firstChild;
        while (node != null) {
            if (node.nodeType == 3) {
                var txts = prettifyText(node.data, doc.documentElement.lang).split("-");
                var tmpNode = doc.createElement("a");
                for (var i=0;i<txts.length;i++) {
                    if (i < txts.length-1) {
                        tmpNode.appendChild(doc.createTextNode(txts[i]+ '-'));
                        tmpNode.appendChild(doc.createElement("wbr")); 
                    }
                    else {
                        tmpNode.appendChild(doc.createTextNode(txts[i]));
                    }
                }
                replaceNodeByChilds(node, tmpNode);
            } 
            else if (node.nodeType == 1) {
                recursiveWalk(doc, node);
            }
            node = node.nextSibling;
        }
    }
}


function prettify_doc(doc) {
    var pp = doc.getElementsByTagName("p");
    for (var i=0;i<pp.length;i++) {
        recursiveWalk(doc, pp[i]);
        pp[i].style.MozHyphens = "auto";
        pp[i].style.textAlign="justify";
    }
    // console.log("Paragraphs prettified ("+doc.documentElement.lang+" language).");
}

self.port.on("prettifyDoc", function() {
    doc = document;
    if (!doc.documentElement.lang) {
        doc.documentElement.lang = navigator.language || "en";
    }
    prettify_doc(doc);
});

function prettifyDocNative(doc) {
    if (!doc.documentElement.lang) {
        doc.documentElement.lang =  "en";
    }
    prettify_doc(doc);
}

