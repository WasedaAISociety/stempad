/// <reference path="./lib/jquery.d.ts" />
interface JQuery
{
	heightLine(): void;
}

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

class Stempad
{
	editorDiv: HTMLElement;
	dictA: Array<Array<string>> = [
		["LMD3UwP5Twms9hnW3yUHAQ", "集合", "ある特定のはっきり識別できる条件に合うものを一まとめにして考えた、全体。"],
		["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
		["mp2ZnRn/T9WSrVixhzGVdA", "数学", "数および図形についての学問"],
	];
	dictB: Array<Array<string>> = [
		["k8sxescVRqK8YY+DsB3B8Q", "集合", "一か所に集まる、または集めること。"],
		["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
		["mp2ZnRn/T9WSrVixhzGVdA", "数学", "数および図形についての学問"],
	];
	//
	constructor(ediv: HTMLElement){
		var that:Stempad = this;
		//
		this.editorDiv = ediv;
		this.editorDiv.onclick = function(e: any){ e.stopPropagation(); };
		this.editorDiv.innerHTML = "集合は、集合論のみならず現代数学全体における最も基本的な概念の一つであり、現代数学のほとんどが集合と写像の言葉で書かれていると言ってよい。";
		this.markupBasedOnDictionary([this.dictA, this.dictB]);
		this.showDictionary();
		document.body.onclick = function(){ that.markupBasedOnDictionary([that.dictA, that.dictB]); };
	}
	openWordMenu(elem: any): void
	{
		console.log(elem);
		console.log(elem.text);
	}
	markupBasedOnDictionary(dicts: Array<Array<any>>): void
	{
		var text = this.getEditorText();
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
				var idInDictA = this.dictA.includes(separated[i], function(a: string, b: string){ return a[1] == b; })[0];
				var idInDictB = this.dictB.includes(separated[i], function(a: string, b: string){ return a[1] == b; })[0];
				if(idInDictA === idInDictB){
					separated[i] = '<span style="background-color: #c0ffee">' + separated[i].escapeForHTML() + "</span>";
				} else{
					separated[i] = '<span style="background-color: #ffc0ee">' + separated[i].escapeForHTML() + "</span>";
				}
			} else{
				separated[i] = separated[i].escapeForHTML();
			}
		}
		text = separated.join("");
		this.setEditorText(text);
	}
	getEditorText(): string
	{
		var text = "";
		if(this.editorDiv.hasChildNodes()){
			for(var i = 0; i < this.editorDiv.childNodes.length; i++){
				if(i != 0){
					text += "\n";
				}
				text += $(this.editorDiv.childNodes[i]).text();
			}
		} else{
			text += $(this.editorDiv).text();
		}
		return text;
	}
	setEditorText(htmlText: string): void
	{
		this.editorDiv.innerHTML = "";
		var rowList = htmlText.split("\n");
		for(var i = 0; i < rowList.length; i++){
			var newDiv = document.createElement('div');
			newDiv.innerHTML = rowList[i];
			this.editorDiv.appendChild(newDiv);
		}
		return;
	}
	showDictionary(): void
	{
		var dictBasedID = this.dictA.unionWith(this.dictB, function(a, b){
			return (a[0] === b[0]);
		});
		var dictBasedWord = this.dictA.unionWith(this.dictB, function(a, b){
			return (a[1] === b[1]);
		});
		console.log(dictBasedID);
		console.log(dictBasedWord);
		//
		var elem = document.getElementById("dict");
		var htmlSrc = "";
		//
		for(var i = 0; i < dictBasedWord.length; i++){
			htmlSrc += '<div class="row heightLineParent">';
			var w:string = dictBasedWord[i][1];
			var idList = dictBasedID.getAllMatched(w, function(a: any, b: any){
				return a[1] === b;
			});
			if(idList.length == 1){
				var a = this.dictA.includes(w, function(a, b){ return (a[1] === b); });
				var b = this.dictB.includes(w, function(a, b){ return (a[1] === b); });
				if(a && b){
					htmlSrc += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"></div>';
					htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictCommon"><dl>';
					htmlSrc += "<dt>" + a[1].escapeForHTML() + "</dt>";
					htmlSrc += "<dd>" + a[2].escapeForHTML() + "</dd>";
					htmlSrc += '</dl></div>';
				} else if(a){
					var e = this.dictB.includes(w, function(a, b){ return (a[1] === b); });
					htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictA"><dl>';
					htmlSrc += "<dt>" + a[1].escapeForHTML() + "</dt>";
					htmlSrc += "<dd>" + a[2].escapeForHTML() + "</dd>";
					htmlSrc += '</dl></div>';
				} else{
					htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"></div>';
					var e = this.dictB.includes(w, function(a, b){ return (a[1] === b); });
					htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictB"><dl>';
					htmlSrc += "<dt>" + b[1].escapeForHTML() + "</dt>";
					htmlSrc += "<dd>" + b[2].escapeForHTML() + "</dd>";
					htmlSrc += '</dl></div>';
				}
			} else{
				var e = this.dictA.includes(w, function(a, b){ return (a[1] === b); });
				htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictA"><dl>';
				htmlSrc += "<dt>" + e[1].escapeForHTML() + "</dt>";
				htmlSrc += "<dd>" + e[2].escapeForHTML() + "</dd>";
				htmlSrc += '</dl></div>';
				var e = this.dictB.includes(w, function(a, b){ return (a[1] === b); });
				htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 dictB"><dl>';
				htmlSrc += "<dt>" + e[1].escapeForHTML() + "</dt>";
				htmlSrc += "<dd>" + e[2].escapeForHTML() + "</dd>";
				htmlSrc += '</dl></div>';
			}
			htmlSrc += '</div>';
		}
		elem.innerHTML = htmlSrc;
		$(".heightLineParent>div").heightLine();
	}
}

$(function(){
	var stempad:Stempad = new Stempad(document.getElementById("editorbody"));
	/*
	setInterval(function(){
		markupBasedOnDictionary([dictA, dictB]);
	},1000);
	*/
})

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
