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

enum WordType
{
	NotFound,
	OnlyInOwn,
	OnlyInDocument,
	SamePerception,
	DifferentPerception,
}

class Stempad
{
	editorDiv: HTMLElement;
	perceptLevelDiv: HTMLElement;
	perceptLevelTextDiv: HTMLElement;
	dictA: Array<any> = new Array<any>();
	dictB: Array<any> = new Array<any>();
	dictBasedID: Array<Array<string>>;
	dictBasedWord: Array<Array<string>>;
	wordListInDict: Array<string>;
	agreementRate: number = 0;
	//
	constructor(ediv: HTMLElement, pdiv: HTMLElement, ptdiv: HTMLElement){
		var that:Stempad = this;
		//
		this.editorDiv = ediv;
		this.perceptLevelDiv = pdiv;
		this.perceptLevelTextDiv = ptdiv;
		this.editorDiv.onclick = function(e: any){ e.stopPropagation(); };
		this.setDictionary();
		document.body.onclick = function(){ that.markupBasedOnDictionary(); };
	}
	openWordMenu(elem: any): void
	{
		console.log(elem);
		console.log(elem.text);
	}
	//
	// Editor
	//
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
	public setEditorText(plainText: string): void
	{
		this.setEditorHTMLText(plainText.escapeForHTML());
		this.markupBasedOnDictionary();
	}
	private setEditorHTMLText(htmlText: string): void
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
	//
	// Dictionary
	//
	setDictionary(dictOwn?: Array<Array<string>>, dictDocument?: Array<Array<string>>): void
	{
		this.dictA = dictOwn ? dictOwn : this.dictA;
		this.dictB = dictDocument ? dictDocument : this.dictB;
		//
		this.dictBasedID = this.dictA.unionWith(this.dictB, function(a, b){
			return (a[0] === b[0]);
		});
		this.dictBasedWord = this.dictA.unionWith(this.dictB, function(a, b){
			return (a[1] === b[1]);
		});
		//
		this.wordListInDict = this.dictBasedWord.propertiesNamed(1);
		this.wordListInDict.stableSort(function(a, b){
			return a.length - b.length;
		});
		this.showDictionary();
	}
	showDictionary(): void
	{
		var elem = document.getElementById("dict");
		var htmlSrc = "";
		var showWordCard = function(wt: Array<string>, c: string): void
		{
			htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 ' + c + '"><dl>';
			htmlSrc += "<dt>" + wt[1].escapeForHTML() + "</dt>";
			htmlSrc += "<dd>" + wt[2].escapeForHTML() + "</dd>";
			htmlSrc += '</dl></div>';
		}
		//
		for(var i = 0; i < this.dictBasedWord.length; i++){
			htmlSrc += '<div class="row heightLineParent">';
			var w:string = this.dictBasedWord[i][1];
			var idList = this.dictBasedID.getAllMatched(w, function(a: any, b: any){
				return a[1] === b;
			});
			if(idList.length == 1){
				var a = this.dictA.includes(w, function(a, b){ return (a[1] === b); });
				var b = this.dictB.includes(w, function(a, b){ return (a[1] === b); });
				if(a && b){
					htmlSrc += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3"></div>';
					showWordCard(a, "dictCommon");
				} else if(a){
					showWordCard(a, "dictA");
				} else{
					htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"></div>';
					showWordCard(b, "dictB");
				}
			} else{
				var e = this.dictA.includes(w, function(a, b){ return (a[1] === b); });
				showWordCard(e, "dictA");
				var e = this.dictB.includes(w, function(a, b){ return (a[1] === b); });
				showWordCard(e, "dictB");
			}
			htmlSrc += '</div>';
		}
		elem.innerHTML = htmlSrc;
		$(".heightLineParent>div").heightLine();
	}
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
	markupBasedOnDictionary(): void
	{
		var text = this.getEditorText();
		var separated = text.splitByArraySeparatorSeparatedLong(this.wordListInDict);
		var wordCount = 0;
		var samePerceptionCount = 0;
		for(var i = 0; i < separated.length; i++){
			var type: WordType = this.getWordType(separated[i]);
			if(type == WordType.SamePerception){
				separated[i] = '<span style="background-color: #c0ffee">' + separated[i].escapeForHTML() + "</span>";
				wordCount++;
				samePerceptionCount++;
			} else if(type == WordType.DifferentPerception){
				separated[i] = '<span style="background-color: #ffc0ee">' + separated[i].escapeForHTML() + "</span>";
				wordCount++;
			} else{
				separated[i] = separated[i].escapeForHTML();
			}
		}
		this.agreementRate = samePerceptionCount / wordCount * 100;
		this.perceptLevelDiv.style.width = this.agreementRate + "%";
		this.perceptLevelTextDiv.innerHTML = "一致度: " + this.agreementRate.toFixed(2) + "%";
		text = separated.join("");
		this.setEditorHTMLText(text);
	}
}

$(function(){
	var stempad:Stempad = new Stempad(
		document.getElementById("editorbody"),
		document.getElementById("perceptLevel"),
		document.getElementById("perceptLevelText")
	);
	stempad.setDictionary(
		[
			["LMD3UwP5Twms9hnW3yUHAQ", "集合", "ある特定のはっきり識別できる条件に合うものを一まとめにして考えた、全体。"],
			["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
			["mp2ZnRn/T9WSrVixhzGVdA", "数学", "数および図形についての学問"],
		],
		[
			["k8sxescVRqK8YY+DsB3B8Q", "集合", "一か所に集まる、または集めること。"],
			["67SNKR52QYqtrZH57SqMNA", "概念", "事象に対して、抽象化・ 普遍化してとらえた、思考の基礎となる基本的な形態として、脳の機能によってとらえたもの。"],
			["mp2ZnRn/T9WSrVixhzGVdA", "数学", "数および図形についての学問"],
		]
	);
	stempad.setEditorText("集合は、集合論のみならず現代数学全体における最も基本的な概念の一つであり、現代数学のほとんどが集合と写像の言葉で書かれていると言ってよい。");
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
