//
// クラス拡張
//
;
Array.prototype.removeAllObject = function (anObject) {
    //Array中にある全てのanObjectを削除し、空いた部分は前につめる。
    //戻り値は削除が一回でも実行されたかどうか
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
    //Array中にある最初のanObjectを削除し、空いた部分は前につめる。
    //fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
    //戻り値は削除が実行されたかどうか
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
/*
Array.prototype.removeByIndex = function(index, length){
    //Array[index]を削除し、空いた部分は前につめる。
    if(length === undefined){
        length = 1;
    }
    this.splice(index, length);
    return;
}
Array.prototype.insertAtIndex = function(index, data){
    return this.splice(index, 0, data);
}
Array.prototype.symmetricDifferenceWith = function(b, fEqualTo){
    // 対称差(XOR)集合を求める
    // fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
    var a = this.copy();
    var ei;
    for(var i = 0, len = b.length; i < len; i++){
        ei = a.getIndex(b[i], fEqualTo)
        if(ei != -1){
            a.removeByIndex(ei);
        } else{
            a.push(b[i]);
        }
    }
    return a;
}
Array.prototype.intersectionWith = function(b, fEqualTo){
    //積集合（AND）を求める
    //fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
    var r = new Array();
    for(var i = 0, len = b.length; i < len; i++){
        if(this.includes(b[i], fEqualTo)){
            r.push(b[i]);
        }
    }
    return r;
}
*/
Array.prototype.unionWith = function (b, fEqualTo) {
    //和集合（OR）を求める
    //fEqualToは省略可能で、評価関数fEqualTo(a[i], b[j])を設定する。
    var r = new Array();
    for (var i = 0, len = b.length; i < len; i++) {
        if (!this.includes(b[i], fEqualTo)) {
            r.push(b[i]);
        }
    }
    return this.concat(r);
};
/*
Array.prototype.isEqualTo = function(b, fEqualTo){
    //retv: false or true.
    //二つの配列が互いに同じ要素を同じ個数だけ持つか調べる。
    //fEqualToは省略可能で、評価関数fEqualTo(a[i], b[i])を設定する。
    //fEqualToが省略された場合、二要素が全く同一のオブジェクトかどうかによって評価される。
    var i, iLen;
    if(!(b instanceof Array) || this.length !== b.length){
        return false;
    }
    iLen = this.length;
    if(fEqualTo == undefined){
        for(i = 0; i < iLen; i++){
            if(this[i] !== b[i]){
                break;
            }
        }
    } else{
        for(i = 0; i < iLen; i++){
            if(fEqualTo(this[i], b[i])){
                break;
            }
        }
    }
    if(i === iLen){
        return true;
    }
    return false;
}
*/
Array.prototype.includes = function (obj, fEqualTo) {
    //含まれている場合は配列内のそのオブジェクトを返す
    //fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
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
/*
Array.prototype.getIndex = function(obj, fEqualTo){
    // 含まれている場合は配列内におけるそのオブジェクトの添字を返す。
    // 見つからなかった場合、-1を返す。
    //fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
    if(fEqualTo == undefined){
        for(var i = 0, len = this.length; i < len; i++){
            if(this[i] == obj){
                return i;
            }
        }
    } else{
        for(var i = 0, len = this.length; i < len; i++){
            if(fEqualTo(this[i], obj)){
                return i;
            }
        }
    }
    return -1;
}
*/
Array.prototype.getAllMatched = function (obj, fEqualTo) {
    // 評価関数が真となる要素をすべて含んだ配列を返す。
    // 返すべき要素がない場合は空配列を返す。
    // fEqualToは省略可能で、評価関数fEqualTo(array[i], obj)を設定する。
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
/*
Array.prototype.last = function(n){
    var n = (n === undefined) ? 1 : n;
    return this[this.length - n];
}
Array.prototype.search2DLineIndex = function(column, obj, fEqualTo){
    //与えられた配列を二次元配列として解釈し
    //array[n][column]がobjと等価になる最初の行nを返す。
    //fEqualToは省略可能で、評価関数fEqualTo(array[n][column], obj)を設定する。
    //該当する行がなかった場合、戻り値はundefinedとなる。
    if(fEqualTo == undefined){
        for(var i = 0, iLen = this.length; i < iLen; i++){
            if(this[i] instanceof Array && this[i][column] == obj){
                return i;
            }
        }
    } else{
        for(var i = 0, iLen = this.length; i < iLen; i++){
            if(this[i] instanceof Array && fEqualTo(this[i][column], obj)){
                return i;
            }
        }
    }
    return undefined;
}
Array.prototype.search2DObject = function(searchColumn, retvColumn, obj, fEqualTo){
    //与えられた配列を二次元配列として解釈し
    //array[n][searchColumn]がobjと等価になる最初の行のオブジェクトarray[n][retvColumn]を返す。
    //fEqualToは省略可能で、評価関数fEqualTo(array[n][searchColumn], obj)を設定する。
    //該当する行がなかった場合、戻り値はundefinedとなる。
    if(fEqualTo == undefined){
        for(var i = 0, iLen = this.length; i < iLen; i++){
            if(this[i] instanceof Array && this[i][searchColumn] == obj){
                return this[i][retvColumn];
            }
        }
    } else{
        for(var i = 0, iLen = this.length; i < iLen; i++){
            if(this[i] instanceof Array && fEqualTo(this[i][searchColumn], obj)){
                return this[i][retvColumn];
            }
        }
    }
    return undefined;
}
*/
Array.prototype.pushUnique = function (obj, fEqualTo) {
    //値が既に存在する場合は追加しない。評価関数fEqualTo(array[i], obj)を設定することができる。
    //結果的に配列内にあるオブジェクトが返される。
    var o = this.includes(obj, fEqualTo);
    if (!o) {
        this.push(obj);
        return obj;
    }
    return o;
};
Array.prototype.stableSort = function (f) {
    // http://blog.livedoor.jp/netomemo/archives/24688861.html
    // Chrome等ではソートが必ずしも安定ではないので、この関数を利用する。
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
/*
Array.prototype.splitByArray = function(separatorList){
    //Array中の文字列をseparatorList内の文字列でそれぞれで分割し、それらの文字列が含まれた配列を返す。
    var retArray = new Array();
    
    for(var i = 0, iLen = this.length; i < iLen; i++){
        retArray = retArray.concat(this[i].splitByArray(separatorList));
    }
    
    return retArray;
}
*/
Array.prototype.propertiesNamed = function (pName) {
    //Array内の各要素のプロパティpNameのリストを返す。
    var retArray = new Array();
    for (var i = 0, iLen = this.length; i < iLen; i++) {
        retArray.push(this[i][pName]);
    }
    return retArray;
};
//文字列関連
String.prototype.replaceAll = function (org, dest) {
    //String中にある文字列orgを文字列destにすべて置換する。
    //http://www.syboos.jp/webjs/doc/string-replace-and-replaceall.html
    return this.split(org).join(dest);
};
/*
String.prototype.compareLeftHand = function (search){
    //前方一致長を求める。
    for(var i = 0; search.charAt(i) != ""; i++){
        if(search.charAt(i) != this.charAt(i)){
            break;
        }
    }
    return i;
}

String.prototype.splitByArray = function(separatorList){
    //リスト中の文字列それぞれで分割された配列を返す。
    //separatorはそれ以前の文字列の末尾に追加された状態で含まれる。
    //"abcdefg".splitByArray(["a", "e", "g"]);
    //	= ["a", "bcde", "fg"]
    var retArray = new Array();
    retArray[0] = this;
    
    for(var i = 0; i < separatorList.length; i++){
        var tmpArray = new Array();
        for(var k = 0; k < retArray.length; k++){
            tmpArray[k] = retArray[k].split(separatorList[i]);
            if(tmpArray[k][tmpArray[k].length - 1] == ""){
                tmpArray[k].splice(tmpArray[k].length - 1, 1);
                if(tmpArray[k] && tmpArray[k].length > 0){
                    for(var m = 0; m < tmpArray[k].length; m++){
                        tmpArray[k][m] += separatorList[i];
                    }
                }
            } else{
                for(var m = 0; m < tmpArray[k].length - 1; m++){
                    tmpArray[k][m] += separatorList[i];
                }
            }
        }
        retArray = new Array();
        retArray = retArray.concat.apply(retArray, tmpArray);
    }
    
    if(retArray.length == 0){
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
        //文字列が空であるとき、split メソッドは、空の配列ではなく、1 つの空文字列を含む配列を返します。
        retArray.push("");
    }
    
    return retArray;
}

String.prototype.splitByArraySeparatorSeparated = function(separatorList){
    //リスト中の文字列それぞれで分割された配列を返す。
    //separatorも分割された状態で含まれる。
    //"abcdefg".splitByArraySeparatorSeparated(["a", "e", "g"]);
    //	= ["a", "bcd", "e", "f", "g"]
    var retArray = new Array();
    retArray[0] = this;
    
    for(var i = 0; i < separatorList.length; i++){
        var tmpArray = new Array();
        for(var k = 0; k < retArray.length; k++){
            var tmpArraySub = retArray[k].split(separatorList[i]);
            tmpArray[k] = new Array();
            for(var m = 0, mLen = tmpArraySub.length - 1; m < mLen; m++){
                if(tmpArraySub[m] != ""){
                    tmpArray[k].push(tmpArraySub[m]);
                }
                tmpArray[k].push(separatorList[i]);
            }
            if(tmpArraySub[tmpArraySub.length - 1] != ""){
                tmpArray[k].push(tmpArraySub[m]);
            }
        }
        retArray = new Array();
        retArray = retArray.concat.apply(retArray, tmpArray);
    }
    
    if(retArray.length == 0){
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
        //文字列が空であるとき、split メソッドは、空の配列ではなく、1 つの空文字列を含む配列を返します。
        retArray.push("");
    }
    
    return retArray;
}
*/
String.prototype.splitByArraySeparatorSeparatedLong = function (separatorList) {
    //リスト中の文字列それぞれで分割された配列を返す。
    //separatorも分割された状態で含まれる。
    //separatorListの前の方にあるseparatorは、後方のseparatorによって分割されない。
    //"abcdefgcdefg".splitByArraySeparatorSeparatedLong(["bcde", "cd", "f"]);
    //	= ["a", "bcde", "f", "g", "cd", "e", "f", "g"]
    //"for (i = 0; i != 15; i++) {".splitByArraySeparatorSeparatedLong(["!=", "(", ")", "="]);
    //	= ["for ", "(", "i ", "=", " 0; i ", "!=", " 15; i++", ")", " {"]
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
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
        //文字列が空であるとき、split メソッドは、空の配列ではなく、1 つの空文字列を含む配列を返します。
        retArray.push("");
    }
    return retArray;
};
/*
String.prototype.trim = function(str){
    return this.replace(/^[ 　	]+|[ 　	]+$/g, "").replace(/\n$/g, "");
}
//http://d.hatena.ne.jp/favril/20090514/1242280476
String.prototype.isKanjiAt = function(index){
    var u = this.charCodeAt(index);
    if( (0x4e00  <= u && u <= 0x9fcf) ||	// CJK統合漢字
        (0x3400  <= u && u <= 0x4dbf) ||	// CJK統合漢字拡張A
        (0x20000 <= u && u <= 0x2a6df) ||	// CJK統合漢字拡張B
        (0xf900  <= u && u <= 0xfadf) ||	// CJK互換漢字
        (0x2f800 <= u && u <= 0x2fa1f)){ 	// CJK互換漢字補助
        return true;
    }
    return false;
}
String.prototype.isHiraganaAt = function(index){
    var u = this.charCodeAt(index);
    if(0x3040 <= u && u <= 0x309f){
        return true;
    }
    return false;
}
String.prototype.isKatakanaAt = function(index){
    var u = this.charCodeAt(index);
    if(0x30a0 <= u && u <= 0x30ff){
        return true;
    }
    return false;
}
String.prototype.isHankakuKanaAt = function(index){
    var u = this.charCodeAt(index);
    if(0xff61 <= u && u <= 0xff9f){
        return true;
    }
    return false;
}
*/
String.prototype.escapeForHTML = function () {
    var e = document.createElement('div');
    e.appendChild(document.createTextNode(this));
    return e.innerHTML;
};
/*

// http://stackoverflow.com/questions/641857/javascript-window-resize-event
// addEvent(window, "resize", function_reference);
addEvent = function(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
};
*/
/// <reference path="./lib/jquery.d.ts" />
/*
document.addEventListener('mouseup',function(ev){
    var selection = getSelection();
    if(selection.rangeCount > 0){
        var range = selection.getRangeAt(0);
        if(range.collapsed){
            return;
        }
        //新しいspan要素を作る
        var newspan = document.createElement('span');
        newspan.onclick = function(){
            openWordMenu(newspan);
        }
        newspan.text = range.toString();
        //background-colorを設定
        newspan.style.backgroundColor="#ffff00";
        //
        var df = range.extractContents();
        console.log(df)
        newspan.appendChild(df);
        range.insertNode(newspan);
    }
},false);
*/
var WordType;
(function (WordType) {
    WordType[WordType["NotFound"] = 0] = "NotFound";
    WordType[WordType["OnlyInOwn"] = 1] = "OnlyInOwn";
    WordType[WordType["OnlyInDocument"] = 2] = "OnlyInDocument";
    WordType[WordType["SamePerception"] = 3] = "SamePerception";
    WordType[WordType["DifferentPerception"] = 4] = "DifferentPerception";
})(WordType || (WordType = {}));
var StempadWord = (function () {
    //
    function StempadWord(word, env) {
        this.word = word;
        this.tooltipHTML = null;
        //
        var t = env.dictBasedWord.includes(word, function (a, b) { return (a[1] === b); });
        if (!t) {
            this.type = WordType.NotFound;
            return;
        }
        t = t[1];
        var a = env.dictA.includes(t, function (a, b) { return (a[1] === b); });
        var b = env.dictB.includes(t, function (a, b) { return (a[1] === b); });
        if (a && b) {
            if (a[0] === b[0]) {
                this.type = WordType.SamePerception;
            }
            else {
                this.type = WordType.DifferentPerception;
            }
            this.wordIDInOwnDictionary = a[0];
            this.wordIDInDocumentDictionary = b[0];
        }
        else if (a) {
            this.type = WordType.OnlyInOwn;
            this.wordIDInOwnDictionary = a[0];
        }
        else {
            this.type = WordType.OnlyInDocument;
            this.wordIDInDocumentDictionary = b[0];
        }
        this.tooltipHTML = word.escapeForHTML();
    }
    return StempadWord;
})();
var Stempad = (function () {
    //
    function Stempad() {
        this.dictA = new Array();
        this.dictB = new Array();
        this.agreementRate = 0;
        var that = this;
        //
        this.editorDiv = $("#editorbody")[0];
        this.perceptLevelDiv_same = $("#perceptLevelParent .progress-bar-success")[0];
        this.perceptLevelDiv_notfound = $("#perceptLevelParent .progress-bar-warning")[0];
        this.perceptLevelDiv_different = $("#perceptLevelParent .progress-bar-danger")[0];
        this.perceptLevelDiv_text = $("#perceptLevelParent #perceptLevelText")[0];
        //
        this.editorDiv.onclick = function (e) { e.stopPropagation(); };
        this.setDictionary();
        document.body.onclick = function () {
            $(".highlight-same-perception, .highlight-different-perception, .highlight-only-in-doc").tooltip('hide').each(function () {
                this.tipStatus = false;
                this.preventAutoHide = false;
            });
            that.markupBasedOnDictionary();
        };
    }
    Stempad.prototype.openWordMenu = function (elem) {
        console.log(elem);
        console.log(elem.text);
    };
    //
    // Editor
    //
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
    Stempad.prototype.setEditorText = function (plainText) {
        this.setEditorHTMLText(plainText.escapeForHTML());
        this.markupBasedOnDictionary();
    };
    Stempad.prototype.setEditorHTMLText = function (htmlText) {
        this.editorDiv.innerHTML = "";
        var rowList = htmlText.split("\n");
        for (var i = 0; i < rowList.length; i++) {
            var newDiv = document.createElement('div');
            newDiv.innerHTML = rowList[i];
            this.editorDiv.appendChild(newDiv);
        }
        return;
    };
    //
    // Dictionary
    //
    Stempad.prototype.setDictionary = function (dictOwn, dictDocument) {
        this.dictA = dictOwn ? dictOwn : this.dictA;
        this.dictB = dictDocument ? dictDocument : this.dictB;
        //
        this.dictBasedID = this.dictA.unionWith(this.dictB, function (a, b) {
            return (a[0] === b[0]);
        });
        this.dictBasedWord = this.dictA.unionWith(this.dictB, function (a, b) {
            return (a[1] === b[1]);
        });
        //
        this.wordListInDict = this.dictBasedWord.propertiesNamed(1);
        this.wordListInDict.stableSort(function (a, b) {
            return a.length - b.length;
        });
        this.showDictionary();
    };
    Stempad.prototype.showDictionary = function () {
        var elem = document.getElementById("dict");
        var htmlSrc = "";
        var showWordCard = function (wt, c) {
            htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 ' + c + '"><dl>';
            htmlSrc += "<dt>" + wt[1].escapeForHTML() + "</dt>";
            htmlSrc += "<dd>" + wt[2].escapeForHTML() + "</dd>";
            htmlSrc += '</dl></div>';
        };
        //
        for (var i = 0; i < this.dictBasedWord.length; i++) {
            htmlSrc += '<div class="row heightLineParent">';
            var w = this.dictBasedWord[i][1];
            var idList = this.dictBasedID.getAllMatched(w, function (a, b) {
                return a[1] === b;
            });
            if (idList.length == 1) {
                var a = this.dictA.includes(w, function (a, b) { return (a[1] === b); });
                var b = this.dictB.includes(w, function (a, b) { return (a[1] === b); });
                if (a && b) {
                    htmlSrc += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"></div>';
                    showWordCard(a, "dict-common");
                }
                else if (a) {
                    showWordCard(a, "dict-own");
                }
                else {
                    htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"></div>';
                    showWordCard(b, "dict-only-in-doc");
                }
            }
            else {
                var e = this.dictA.includes(w, function (a, b) { return (a[1] === b); });
                showWordCard(e, "dict-own");
                var e = this.dictB.includes(w, function (a, b) { return (a[1] === b); });
                showWordCard(e, "dict-doc");
            }
            htmlSrc += '</div>';
        }
        elem.innerHTML = htmlSrc;
        //
        var list = $(".heightLineParent");
        for (var i = 0; i < list.length; i++) {
            $(list[i].childNodes).heightLine();
        }
    };
    /*
    getWordType(w: string): WordType
    {
        var t = this.dictBasedWord.includes(w, function(a: Array<any>, b: string){ return (a[1] ===b); });
        if(!t){
            return WordType.NotFound;
        }
        t = t[1];
        var a = this.dictA.includes(t, function(a, b){ return (a[1] === b); });
        var b = this.dictB.includes(t, function(a, b){ return (a[1] === b); });
        if(a && b){
            if(a[0] === b[0]){
                return WordType.SamePerception;
            } else{
                return WordType.DifferentPerception;
            }
        } else if(a){
            return WordType.OnlyInOwn;
        } else{
            return WordType.OnlyInDocument;
        }
    }
    */
    Stempad.prototype.markupBasedOnDictionary = function () {
        var text = this.getEditorText();
        var separated = text.splitByArraySeparatorSeparatedLong(this.wordListInDict);
        var wordCount = 0;
        var samePerceptionCount = 0;
        var perceptionNotFoundCount = 0;
        for (var i = 0; i < separated.length; i++) {
            var wordTag = new StempadWord(separated[i], this);
            if (wordTag.type == WordType.SamePerception) {
                separated[i] = '<span class="highlight-same-perception w' + UUID.convertFromBase64String(wordTag.wordIDInDocumentDictionary) + '">' + separated[i].escapeForHTML() + "</span>";
                wordCount++;
                samePerceptionCount++;
            }
            else if (wordTag.type == WordType.DifferentPerception) {
                separated[i] = '<span class="highlight-different-perception w' + UUID.convertFromBase64String(wordTag.wordIDInDocumentDictionary) + '">' + separated[i].escapeForHTML() + "</span>";
                wordCount++;
            }
            else if (wordTag.type == WordType.OnlyInDocument) {
                separated[i] = '<span class="highlight-only-in-doc w' + UUID.convertFromBase64String(wordTag.wordIDInDocumentDictionary) + '">' + separated[i].escapeForHTML() + "</span>";
                wordCount++;
                perceptionNotFoundCount++;
            }
            else {
                separated[i] = separated[i].escapeForHTML();
            }
        }
        this.agreementRate = samePerceptionCount / wordCount * 100;
        this.perceptLevelDiv_same.style.width = (samePerceptionCount / wordCount * 100) + "%";
        this.perceptLevelDiv_notfound.style.width = (perceptionNotFoundCount / wordCount * 100) + "%";
        this.perceptLevelDiv_different.style.width = (100 - ((samePerceptionCount + perceptionNotFoundCount) / wordCount * 100)) + "%";
        this.perceptLevelDiv_text.innerHTML = "一致度: " + this.agreementRate.toFixed(2) + "%";
        text = separated.join("");
        this.setEditorHTMLText(text);
        //
        for (var i = 0; i < this.dictBasedID.length; i++) {
            var classSelector = ".w" + UUID.convertFromBase64String(this.dictBasedID[i][0]);
            var wordTag = new StempadWord(this.dictBasedID[i][1], this);
            var templateHTML;
            if (wordTag.type == WordType.SamePerception) {
                templateHTML = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner highlightip-same-perception"></div></div>';
            }
            else if (wordTag.type == WordType.DifferentPerception) {
                templateHTML = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner highlightip-different-perception"></div></div>';
            }
            else if (wordTag.type == WordType.OnlyInDocument) {
                templateHTML = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner highlightip-only-in-doc"></div></div>';
            }
            else {
                continue;
            }
            //
            var htmlStr = "<h4>" + this.dictBasedID[i][1] + "</h4><pre>ID: " + this.dictBasedID[i][0] + "</pre><p>" + this.dictBasedID[i][2] + "</p>";
            $(classSelector).tooltip({
                title: htmlStr,
                placement: "bottom",
                html: true,
                template: templateHTML,
                trigger: 'manual',
                container: 'body'
            }).on("mouseenter", function () {
                if (!this.tipStatus) {
                    $(this).tooltip('show');
                    this.tipStatus = true;
                }
            }).on("mouseleave", function () {
                if (!this.preventAutoHide && this.tipStatus) {
                    $(this).tooltip('hide');
                    this.tipStatus = false;
                }
            }).on("click", function () {
                this.preventAutoHide = !this.preventAutoHide;
                event.stopPropagation();
            });
        }
    };
    return Stempad;
})();
$(function () {
    $('#editorbody').tooltip({
        selector: "a[rel=tooltip]"
    });
    var stempad = new Stempad();
    stempad.setDictionary([
        ["LMD3UwP5Twms9hnW3yUHAQ", "集合", "ある特定のはっきり識別できる条件に合うものを一まとめにして考えた、全体。"],
        ["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
        ["mp2ZnRn/T9WSrVixhzGVdA", "数学", "数および図形についての学問"],
    ], [
        ["k8sxescVRqK8YY+DsB3B8Q", "集合", "一か所に集まる、または集めること。"],
        ["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
        ["mp2ZnRn/T9WSrVixhzGVdA", "数学", "数および図形についての学問"],
        ["UoXrwSmhSgqXwEAQIjvo+g", "写像", "二つの集合が与えられたときに、一方の集合の各元に対し、他方の集合のただひとつの元からなる集合を指定して結びつける対応のことである。"],
    ]);
    stempad.setEditorText("集合は、集合論のみならず現代数学全体における最も基本的な概念の一つであり、現代数学のほとんどが集合と写像の言葉で書かれていると言ってよい。");
});
/*
function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}
*/
//
// UUID
//
var UUID = (function () {
    function UUID() {
    }
    UUID.verifyUUID = function (uuid) {
        // retv: normalized UUID or false.
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
    UUID.convertFromBase64String = function (b64Str) {
        var hex = "";
        var tmp = 0;
        var i;
        if (b64Str.length === 22) {
            // 末尾の==なしも許容
            b64Str += "==";
        }
        for (i = 0; i < b64Str.length; i++) {
            var c = b64Str.charCodeAt(i);
            tmp <<= 6;
            if (0x41 <= c && c <= 0x5a) {
                // 0x00-0x19
                tmp |= (c - 0x41);
            }
            else if (0x61 <= c && c <= 0x7a) {
                // 0x1a-0x33
                tmp |= (c - 0x61 + 0x1a);
            }
            else if (0x30 <= c && c <= 0x39) {
                // 0x34-0x3d
                tmp |= (c - 0x30 + 0x34);
            }
            else if (c === 0x2b) {
                // 0x3e
                tmp |= 0x3e;
            }
            else if (c === 0x2f) {
                // 0x3f
                tmp |= 0x3f;
            }
            else if (c === 0x3d) {
            }
            else {
                throw "Invalid Base64 String.";
            }
            if ((i & 3) === 3) {
                hex += tmp.toString(16);
                tmp = 0;
            }
        }
        hex = hex.substr(0, 32);
        return UUID.convertFromHexString(hex);
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
