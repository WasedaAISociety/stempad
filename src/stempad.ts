/// <reference path="./lib/jquery.d.ts" />
interface JQuery
{
	heightLine(): JQuery;
	tooltip(attr:any): JQuery;
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

class StempadWord
{
	word: string;
	type: WordType;
	wordIDInOwnDictionary: string;
	wordIDInDocumentDictionary: string;
	tooltipHTML: string;
	//
	constructor(word: string, env: Stempad){
		this.word = word;
		this.tooltipHTML = null;
		//
		var t = env.dictBasedWord.includes(word, function(a: Array<any>, b: string){ return (a[1] ===b); });
		if(!t){
			this.type = WordType.NotFound;
			return;
		}
		t = t[1];
		var a = env.dictA.includes(t, function(a, b){ return (a[1] === b); });
		var b = env.dictB.includes(t, function(a, b){ return (a[1] === b); });
		if(a && b){
			if(a[0] === b[0]){
				this.type = WordType.SamePerception;
			} else{
				this.type = WordType.DifferentPerception;
			}
			this.wordIDInOwnDictionary = a[0];
			this.wordIDInDocumentDictionary = b[0];
		} else if(a){
			this.type = WordType.OnlyInOwn;
			this.wordIDInOwnDictionary = a[0];
		} else{
			this.type = WordType.OnlyInDocument;
			this.wordIDInDocumentDictionary = b[0];
		}
		this.tooltipHTML = word.escapeForHTML();
	}
}

class Stempad
{
	editorDiv: HTMLElement;
	perceptLevelDiv_same: HTMLElement;
	perceptLevelDiv_notfound: HTMLElement;
	perceptLevelDiv_different: HTMLElement;
	perceptLevelDiv_text: HTMLElement;
	dictA: Array<any> = new Array<any>();
	dictB: Array<any> = new Array<any>();
	dictBasedID: Array<Array<string>>;
	dictBasedWord: Array<Array<string>>;
	wordListInDict: Array<string>;
	agreementRate: number = 0;
	//
	constructor(){
		var that:Stempad = this;
		//
		this.editorDiv = $("#editorbody")[0];
		this.perceptLevelDiv_same = $("#perceptLevelParent .progress-bar-success")[0];
		this.perceptLevelDiv_notfound = $("#perceptLevelParent .progress-bar-warning")[0];
		this.perceptLevelDiv_different = $("#perceptLevelParent .progress-bar-danger")[0];
		this.perceptLevelDiv_text = $("#perceptLevelParent #perceptLevelText")[0];
		//
		//this.editorDiv.onclick = function(e: any){ e.stopPropagation(); };
		this.setDictionary();
		//document.body.onclick = function(){ that.markupBasedOnDictionary(); };
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
					showWordCard(a, "dict-common");
				} else if(a){
					showWordCard(a, "dict-own");
				} else{
					htmlSrc += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"></div>';
					showWordCard(b, "dict-only-in-doc");
				}
			} else{
				var e = this.dictA.includes(w, function(a, b){ return (a[1] === b); });
				showWordCard(e, "dict-own");
				var e = this.dictB.includes(w, function(a, b){ return (a[1] === b); });
				showWordCard(e, "dict-doc");
			}
			htmlSrc += '</div>';
		}
		elem.innerHTML = htmlSrc;
		//
		var list = $(".heightLineParent");
		for(var i = 0; i < list.length; i++){
			$(list[i].childNodes).heightLine();
		}
	}
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
	markupBasedOnDictionary(): void
	{
		var text = this.getEditorText();
		var separated = text.splitByArraySeparatorSeparatedLong(this.wordListInDict);
		var wordCount = 0;
		var samePerceptionCount = 0;
		var perceptionNotFoundCount = 0;
		for(var i = 0; i < separated.length; i++){
			var wordTag: StempadWord = new StempadWord(separated[i], this);
			if(wordTag.type == WordType.SamePerception){
				separated[i] = '<span class="highlight-same-perception w' + UUID.convertFromBase64String(wordTag.wordIDInDocumentDictionary) + '">' + separated[i].escapeForHTML() + "</span>";
				wordCount++;
				samePerceptionCount++;
			} else if(wordTag.type == WordType.DifferentPerception){
				separated[i] = '<span class="highlight-different-perception w' + UUID.convertFromBase64String(wordTag.wordIDInDocumentDictionary) + '">' + separated[i].escapeForHTML() + "</span>";
				wordCount++;
			} else if(wordTag.type == WordType.OnlyInDocument){
				separated[i] = '<span class="highlight-only-in-doc w' + UUID.convertFromBase64String(wordTag.wordIDInDocumentDictionary) + '">' + separated[i].escapeForHTML() + "</span>";
				wordCount++;
				perceptionNotFoundCount++;
			} else{
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
		for(var i = 0; i < this.dictBasedID.length; i++){
			var classSelector: string = ".w" + UUID.convertFromBase64String(this.dictBasedID[i][0]);
			var wordTag: StempadWord = new StempadWord(this.dictBasedID[i][1], this);
			var templateHTML: string;
			if(wordTag.type == WordType.SamePerception){
				templateHTML = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner highlightip-same-perception"></div></div>';
			} else if(wordTag.type == WordType.DifferentPerception){
				templateHTML = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner highlightip-different-perception"></div></div>';
			} else if(wordTag.type == WordType.OnlyInDocument){
				templateHTML = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner highlightip-only-in-doc"></div></div>';
			} else{
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
			}).on("mouseenter", function (){
				if(!this.tipStatus){
					$(this).tooltip('show');
					this.tipStatus = true;
				}
			}).on("mouseleave", function (){
				if(!this.preventAutoHide && this.tipStatus){
					$(this).tooltip('hide');
					this.tipStatus = false;
				}
			}).on("click", function(){
				this.preventAutoHide = !this.preventAutoHide;
				event.stopPropagation();
			});
		}
		$(document).click(function() {
			$(".highlight-same-perception, .highlight-different-perception, .highlight-only-in-doc").tooltip('hide').each(function(){
				this.tipStatus = false;
				this.preventAutoHide = false;
			});
		});
	}
}

$(function(){
	$('#editorbody').tooltip({
		selector: "a[rel=tooltip]"
	});
	var stempad:Stempad = new Stempad();
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
			["UoXrwSmhSgqXwEAQIjvo+g", "写像", "二つの集合が与えられたときに、一方の集合の各元に対し、他方の集合のただひとつの元からなる集合を指定して結びつける対応のことである。"],
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
