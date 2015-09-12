var editorDiv;
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
onload = function(){
	document.body.onclick = function(){ markupBasedOnDictionary([dictA, dictB]); };
	editorDiv = document.getElementById("editorbody");
	editorDiv.onclick = function(e){ e.stopPropagation(); };
	editorDiv.innerHTML = "集合は、集合論のみならず現代数学全体における最も基本的な概念の一つであり、現代数学のほとんどが集合と写像の言葉で書かれていると言ってよい。";
	/*
	setInterval(function(){
		markupBasedOnDictionary([dictA, dictB]);
	},1000);
	*/
	markupBasedOnDictionary([dictA, dictB]);
	showDictionary(document.getElementById("dictA"), dictA);
	showDictionary(document.getElementById("dictB"), dictB);
	
};
function openWordMenu(elem){
	console.log(elem);
	console.log(elem.text);
}
function markupBasedOnDictionary(dicts){
	var text = getEditorText();
	console.log(text);
	var wList = new Array();
	for(var i = 0; i < dicts.length; i++){
		for(var k = 0; k < dicts[i].length; k++){
			wList.pushUnique(dicts[i][k][1]);
		}
	}
	wList.stableSort(function(a, b){
		return a.length - b.length;
	});
	var separated = text.splitByArraySeparatorSeparatedLong(wList);
	for(var i = 0; i < separated.length; i++){
		if(wList.includes(separated[i])){
			if(dictA.includes(separated[i], function(a, b){ return a[1] == b; })[0] === dictB.includes(separated[i], function(a, b){ return a[1] == b; })[0]){
				separated[i] = '<span style="background-color: #a0dbff">' + escapeHtml(separated[i]) + "</span>";
			} else{
				separated[i] = '<span style="background-color: #ffc0ee">' + escapeHtml(separated[i]) + "</span>";
			}
		} else{
			separated[i] = escapeHtml(separated[i]);
		}
	}
	text = separated.join("");
	setEditorText(text);
}
function getEditorText(){
	var text = "";
	if(editorDiv.hasChildNodes()){
		for(var i = 0; i < editorDiv.childNodes.length; i++){
			if(i != 0){
				text += "\n";
			}
			text += $(editorDiv.childNodes[i]).text();
		}
	} else{
		text += $(editorDiv).text();
	}
	return text;
}
function setEditorText(htmlText){
	editorDiv.innerHTML = "";
	var rowList = htmlText.split("\n");
	for(var i = 0; i < rowList.length; i++){
		var newDiv = document.createElement('div');
		newDiv.innerHTML = rowList[i];
		editorDiv.appendChild(newDiv);
	}
	return;
}
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
var escapeHtml = function (String) {
	var escapeMap = {
		'&': '&amp;',
		"'": '&#x27;',
		'`': '&#x60;',
		'"': '&quot;',
		'<': '&lt;',
		'>': '&gt;'
	};
	var escapeReg = '[';
	var reg;
	for (var p in escapeMap) {
		if (escapeMap.hasOwnProperty(p)) {
			escapeReg += p;
		}
	}
	escapeReg += ']';
	reg = new RegExp(escapeReg, 'g');
	return function escapeHtml (str) {
		str = (str === null || str === undefined) ? '' : '' + str;
		return str.replace(reg, function (match) {
			return escapeMap[match];
		});
	};
}(String);
function showDictionary(elem, dict){
	elem.innerHTML = "<dl>";
	for(var i = 0; i < dict.length; i++){
		elem.innerHTML += "<dt>" + escapeHtml(dict[i][1]) + "</dt>";
		elem.innerHTML += "<dd>" + escapeHtml(dict[i][2]) + "</dd><br/>";
	}
	elem.innerHTML += "</dl>";
}
var dictA = [
	["LMD3UwP5Twms9hnW3yUHAQ", "集合", "ある特定のはっきり識別できる条件に合うものを一まとめにして考えた、全体。"],
	["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
];
var dictB = [
	["k8sxescVRqK8YY+DsB3B8Q", "集合", "一か所に集まる、または集めること。"],
	["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
];