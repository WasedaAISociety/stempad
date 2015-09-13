//
// クラス拡張
//
;
Array.prototype.removeAllObject = function (anObject) {
    var ret = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == anObject) {
            this.splice(i, 1);
            ret = true;
            i--;
        }
    }
    return ret;
};
Array.prototype.removeAnObject = function (anObject, fEqualTo) {
    if (!(fEqualTo instanceof Function)) {
        fEqualTo = function (a, b) { return (a == b); };
    }
    for (var i = 0; i < this.length; i++) {
        if (fEqualTo(this[i], anObject)) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
};
Array.prototype.unionWith = function (b, fEqualTo) {
    var r = new Array();
    for (var i = 0, len = b.length; i < len; i++) {
        if (!this.includes(b[i], fEqualTo)) {
            r.push(b[i]);
        }
    }
    return this.concat(r);
};
Array.prototype.includes = function (obj, fEqualTo) {
    if (fEqualTo == undefined) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] == obj) {
                return this[i];
            }
        }
    }
    else {
        for (var i = 0, len = this.length; i < len; i++) {
            if (fEqualTo(this[i], obj)) {
                return this[i];
            }
        }
    }
    return false;
};
Array.prototype.getAllMatched = function (obj, fEqualTo) {
    var retArray = new Array();
    if (fEqualTo == undefined) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] == obj) {
                retArray.push(this[i]);
            }
        }
    }
    else {
        for (var i = 0, len = this.length; i < len; i++) {
            if (fEqualTo(this[i], obj)) {
                retArray.push(this[i]);
            }
        }
    }
    return retArray;
};
Array.prototype.pushUnique = function (obj, fEqualTo) {
    var o = this.includes(obj, fEqualTo);
    if (!o) {
        this.push(obj);
        return obj;
    }
    return o;
};
Array.prototype.stableSort = function (f) {
    if (f == undefined) {
        f = function (a, b) { return a - b; };
    }
    for (var i = 0; i < this.length; i++) {
        this[i].__id__ = i;
    }
    this.sort.call(this, function (a, b) {
        var ret = f(a, b);
        if (ret == 0) {
            return (a.__id__ > b.__id__) ? 1 : -1;
        }
        else {
            return ret;
        }
    });
    for (var i = 0; i < this.length; i++) {
        delete this[i].__id__;
    }
};
String.prototype.replaceAll = function (org, dest) {
    return this.split(org).join(dest);
};
String.prototype.splitByArraySeparatorSeparatedLong = function (separatorList) {
    var retArray = new Array();
    var checkArray = new Array();
    retArray[0] = this;
    checkArray[0] = false;
    for (var i = 0; i < separatorList.length; i++) {
        var tmpArray = new Array();
        var tmpCheckArray = new Array();
        for (var k = 0; k < retArray.length; k++) {
            if (!checkArray[k]) {
                var tmpArraySub = retArray[k].split(separatorList[i]);
                tmpArray[k] = new Array();
                tmpCheckArray[k] = new Array();
                for (var m = 0, mLen = tmpArraySub.length - 1; m < mLen; m++) {
                    if (tmpArraySub[m] != "") {
                        tmpArray[k].push(tmpArraySub[m]);
                        tmpCheckArray[k].push(false);
                    }
                    tmpArray[k].push(separatorList[i]);
                    tmpCheckArray[k].push(true);
                }
                if (tmpArraySub[tmpArraySub.length - 1] != "") {
                    tmpArray[k].push(tmpArraySub[m]);
                    tmpCheckArray[k].push(false);
                }
            }
            else {
                tmpArray.push([retArray[k]]);
                tmpCheckArray.push([true]);
            }
        }
        retArray = new Array();
        checkArray = new Array();
        retArray = retArray.concat.apply(retArray, tmpArray);
        checkArray = checkArray.concat.apply(checkArray, tmpCheckArray);
    }
    if (retArray.length == 0) {
        retArray.push("");
    }
    return retArray;
};
String.prototype.escapeForHTML = function () {
    var e = document.createElement('div');
    e.appendChild(document.createTextNode(this));
    return e.innerHTML;
};
/// <reference path="./lib/jquery.d.ts" />
var Stempad = (function () {
    function Stempad(ediv) {
        this.dictA = [
            ["LMD3UwP5Twms9hnW3yUHAQ", "集合", "ある特定のはっきり識別できる条件に合うものを一まとめにして考えた、全体。"],
            ["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
            ["mp2ZnRn/T9WSrVixhzGVdA", "数学", "数および図形についての学問"],
        ];
        this.dictB = [
            ["k8sxescVRqK8YY+DsB3B8Q", "集合", "一か所に集まる、または集めること。"],
            ["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
            ["mp2ZnRn/T9WSrVixhzGVdA", "数学", "数および図形についての学問"],
        ];
        var that = this;
        this.editorDiv = ediv;
        this.editorDiv.onclick = function (e) { e.stopPropagation(); };
        this.editorDiv.innerHTML = "集合は、集合論のみならず現代数学全体における最も基本的な概念の一つであり、現代数学のほとんどが集合と写像の言葉で書かれていると言ってよい。";
        this.markupBasedOnDictionary([this.dictA, this.dictB]);
        this.showDictionary();
        document.body.onclick = function () { that.markupBasedOnDictionary([that.dictA, that.dictB]); };
    }
    Stempad.prototype.openWordMenu = function (elem) {
        console.log(elem);
        console.log(elem.text);
    };
    Stempad.prototype.markupBasedOnDictionary = function (dicts) {
        var text = this.getEditorText();
        console.log(text);
        var wList = new Array();
        for (var i = 0; i < dicts.length; i++) {
            for (var k = 0; k < dicts[i].length; k++) {
                wList.pushUnique(dicts[i][k][1]);
            }
        }
        wList.stableSort(function (a, b) {
            return a.length - b.length;
        });
        var separated = text.splitByArraySeparatorSeparatedLong(wList);
        for (var i = 0; i < separated.length; i++) {
            if (wList.includes(separated[i])) {
                var idInDictA = this.dictA.includes(separated[i], function (a, b) { return a[1] == b; })[0];
                var idInDictB = this.dictB.includes(separated[i], function (a, b) { return a[1] == b; })[0];
                if (idInDictA === idInDictB) {
                    separated[i] = '<span style="background-color: #c0ffee">' + separated[i].escapeForHTML() + "</span>";
                }
                else {
                    separated[i] = '<span style="background-color: #ffc0ee">' + separated[i].escapeForHTML() + "</span>";
                }
            }
            else {
                separated[i] = separated[i].escapeForHTML();
            }
        }
        text = separated.join("");
        this.setEditorText(text);
    };
    Stempad.prototype.getEditorText = function () {
        var text = "";
        if (this.editorDiv.hasChildNodes()) {
            for (var i = 0; i < this.editorDiv.childNodes.length; i++) {
                if (i != 0) {
                    text += "\n";
                }
                text += $(this.editorDiv.childNodes[i]).text();
            }
        }
        else {
            text += $(this.editorDiv).text();
        }
        return text;
    };
    Stempad.prototype.setEditorText = function (htmlText) {
        this.editorDiv.innerHTML = "";
        var rowList = htmlText.split("\n");
        for (var i = 0; i < rowList.length; i++) {
            var newDiv = document.createElement('div');
            newDiv.innerHTML = rowList[i];
            this.editorDiv.appendChild(newDiv);
        }
        return;
    };
    Stempad.prototype.showDictionary = function () {
        var dictBasedID = this.dictA.unionWith(this.dictB, function (a, b) {
            return (a[0] === b[0]);
        });
        var dictBasedWord = this.dictA.unionWith(this.dictB, function (a, b) {
            return (a[1] === b[1]);
        });
        console.log(dictBasedID);
        console.log(dictBasedWord);
        var elem = document.getElementById("dict");
        var htmlSrc = "";
        for (var i = 0; i < dictBasedWord.length; i++) {
            htmlSrc += '<div class="row heightLineParent">';
            var w = dictBasedWord[i][1];
            var idList = dictBasedID.getAllMatched(w, function (a, b) {
                return a[1] === b;
            });
            if (idList.length == 1) {
                var a = this.dictA.includes(w, function (a, b) { return (a[1] === b); });
                var b = this.dictB.includes(w, function (a, b) { return (a[1] === b); });
                if (a && b) {
                    htmlSrc += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"></div>';
                    htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictCommon"><dl>';
                    htmlSrc += "<dt>" + a[1].escapeForHTML() + "</dt>";
                    htmlSrc += "<dd>" + a[2].escapeForHTML() + "</dd>";
                    htmlSrc += '</dl></div>';
                }
                else if (a) {
                    var e = this.dictB.includes(w, function (a, b) { return (a[1] === b); });
                    htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictA"><dl>';
                    htmlSrc += "<dt>" + a[1].escapeForHTML() + "</dt>";
                    htmlSrc += "<dd>" + a[2].escapeForHTML() + "</dd>";
                    htmlSrc += '</dl></div>';
                }
                else {
                    htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"></div>';
                    var e = this.dictB.includes(w, function (a, b) { return (a[1] === b); });
                    htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictB"><dl>';
                    htmlSrc += "<dt>" + b[1].escapeForHTML() + "</dt>";
                    htmlSrc += "<dd>" + b[2].escapeForHTML() + "</dd>";
                    htmlSrc += '</dl></div>';
                }
            }
            else {
                var e = this.dictA.includes(w, function (a, b) { return (a[1] === b); });
                htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictA"><dl>';
                htmlSrc += "<dt>" + e[1].escapeForHTML() + "</dt>";
                htmlSrc += "<dd>" + e[2].escapeForHTML() + "</dd>";
                htmlSrc += '</dl></div>';
                var e = this.dictB.includes(w, function (a, b) { return (a[1] === b); });
                htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictB"><dl>';
                htmlSrc += "<dt>" + e[1].escapeForHTML() + "</dt>";
                htmlSrc += "<dd>" + e[2].escapeForHTML() + "</dd>";
                htmlSrc += '</dl></div>';
            }
            htmlSrc += '</div>';
        }
        elem.innerHTML = htmlSrc;
        $(".heightLineParent>div").heightLine();
    };
    return Stempad;
})();
$(function () {
    var stempad = new Stempad(document.getElementById("editorbody"));
});
var UUID = (function () {
    function UUID() {
    }
    UUID.verifyUUID = function (uuid) {
        if (!uuid || uuid.length != (32 + 4)) {
            return false;
        }
        return uuid.toLowerCase();
    };
    UUID.convertFromHexString = function (hex) {
        if (hex.length != 32) {
            return false;
        }
        return this.verifyUUID(hex.substr(0, 8) + "-" +
            hex.substr(8, 4) + "-" +
            hex.substr(12, 4) + "-" +
            hex.substr(16, 4) + "-" +
            hex.substr(20, 12));
    };
    UUID.generateVersion4 = function () {
        var g = this.generate16bitHexStrFromNumber;
        var f = this.generateRandom16bitHexStr;
        var n = this.generateRandom16bitHex;
        return f() + f() + "-" + f() + "-" + g(0x4000 | (n() & 0x0fff)) + "-" + g(0x8000 | (n() & 0x3fff)) + "-" + f() + f() + f();
    };
    UUID.generateRandom16bitHexStr = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).toLowerCase().substring(1);
    };
    UUID.generateRandom16bitHex = function () {
        return ((Math.random() * 0x10000) | 0);
    };
    UUID.generate16bitHexStrFromNumber = function (num) {
        return (num + 0x10000).toString(16).toLowerCase().substring(1);
    };
    UUID.getBase64EncodedUUID = function (uuid) {
        uuid = this.verifyUUID(uuid);
        if (!uuid) {
            return null;
        }
        uuid = uuid.replaceAll("-", "") + "0000";
        var retv = "";
        var f = function (n) {
            if (0 <= n && n < 26) {
                return String.fromCharCode(0x41 + n);
            }
            else if (26 <= n && n < 52) {
                return String.fromCharCode(0x61 + (n - 26));
            }
            else if (52 <= n && n < 62) {
                return String.fromCharCode(0x30 + (n - 52));
            }
            else if (62 <= n && n < 64) {
                return (n == 62) ? "+" : "/";
            }
        };
        for (var i = 0; i < 6; i++) {
            var chunk = parseInt(uuid.substr(i * 6, 6), 16);
            retv += f(0x3f & (chunk >> 18));
            retv += f(0x3f & (chunk >> 12));
            retv += f(0x3f & (chunk >> 6));
            retv += f(0x3f & chunk);
        }
        retv = retv.substr(0, 22) + "==";
        return retv;
    };
    UUID.nullUUID = "00000000-0000-0000-0000-000000000000";
    return UUID;
})();
