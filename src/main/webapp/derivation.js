var transitions = null;

function getStatechart(flowExpression) {
	$.ajax({
		//url: 'http://localhost:8080/Test/rest/statechart/"'+flowExpression+'"',
		//url: 'http://localhost:8888/rest/statechart/"'+flowExpression+'"',
		//url: 'http://gatoalpha-1049.appspot.com/rest/statechart/"'+flowExpression+'"',
		url: 'http://localhost:8080/statechart',
		data: { 'flowExpression': flowExpression},
		success: function(data) {
			//$('div').html(data);
			console.log('success');
			console.log(data);
			var text = '<b>XOR states:</b> ';
			for (i in xorStates) {
				text += xorStates[i] + ', ';
			}
			text = text.substr(0, text.lastIndexOf(','));
			
			text += '<br /><br /><b>Atomic states:</b> ';
			for (i in data.example) {
				text += data.example[i] + ', ';
			}
			text = text.substr(0, text.lastIndexOf(','));
			text += '<br /><br /><b>Transitions:</b> ';
			var transitionsText = '';
			transitions = data.transitions;
			for (i in transitions) {
				transitionsText += transitions[i] + '; ';
			}
			transitionsText = transitionsText.substr(0, text.lastIndexOf(','));
			text += transitionsText;
			console.log(transitionsText);
			
			text += '<br /><br /><b>AND states:</b> ';
			$('#statechart').html(text);
			
			//generate diagram
			var w = window.open();
			w.document.open();
			w.document.write('<html><body><script src="lib/mermaid0-3-0.full.js"></script><div class="mermaid">graph LR;');
			
			//rename states
			Joint.dia.each(function() {
				//console.log(this.properties.content + '(' + this.properties.name + ')');
				for (j in transitions) {
					//console.log('aaaa: '+transitions[j]);
					//console.log('regex: ' + '\\('+this.properties.name+'\\)');
					transitions[j] = transitions[j].replace(new RegExp( '\\('+this.properties.name+'\\)', 'g' ), '('+this.properties.content+' - '+this.properties.name+')');
					transitions[j] = transitions[j].replace(new RegExp( '\\n', 'g' ), ' ');
					//if (transitions[j].contains this.properties.name) {
						//transitions[j] = this.properties.content + ',' + this.properties.name + ',';
					//}
					//console.log('bbbb: '+transitions[j]);
				}
			});
			for (j in transitions) {
				w.document.write(transitions[j] + ';');
			}
			//transitionsText + 
			w.document.write('classDef default fill:#ffffff,stroke:#111,stroke-width:2px;</div>');
			w.document.close();

		},
		beforeSend: function(xhr){
			//$('.loader').css({display:"block"});
			console.log('loading webservice');
			xhr.overrideMimeType("application/json; charset=x-user-defined");
		},
		complete: function(){
			//$('.loader').css({display:"none"});
			console.log('completed');
		},
		error: function(data){
			$('#statechart').html('Sorry, some error occurred when connecting to servers');
			console.log('error');
		}
	});
}

function deriveStatechart() {
	$('#statechart').html('loading...');
	
	combineExpressions();
	combinedExpressions = combinedExpressions.trim();
	$('#combinedExpression').html('Combined Flow Expression: <b>' + combinedExpressions + '</b>');
	
	//prepare expression to send to the server
	combinedExpressions = combinedExpressions.replace(new RegExp( '\\*', 'g' ), '+?');
	combinedExpressions = combinedExpressions.replace(new RegExp( '\\?', 'g' ), '%3F');
	console.log(combinedExpressions);
	
	getStatechart(combinedExpressions);
	
	
}

function listAlternativeBehaviorRefinements() {
	$('#alternativeBehaviorRefinements').html('processing alternative refinements...');
	
	collectExpressions();
	var selectionHtml = '<table class="table table-striped table-condensed">';
	var hasAlternatives = false;
	for(i in flowExpressions) {
		if (flowExpressions[i].match(new RegExp( '\\n'))) {
			hasAlternatives = true;
			selectionHtml += '<tr><td><b>' + i + ':</b><br />';
			var myAlternatives = flowExpressions[i].split(new RegExp( '\\n'));
			for (j in myAlternatives) {
				selectionHtml += '<label class="radio"><input type="radio" name="' + i + '" ';
				selectionHtml += 'value="' + myAlternatives[j] + '" ';
				if (j == 0) selectionHtml += 'checked';
				selectionHtml += '>' + myAlternatives[j] + '</label>';
				
			}
			selectionHtml += '</td></tr>';
			
		}
	}
	selectionHtml += '</table>';
	if (!hasAlternatives) selectionHtml += '<i>No alternative behavior refinement was defined for this model. You can go ahead and derive the statechart.</i>'
	selectionHtml += '<br /></div>';
	
	$('#alternativeBehaviorRefinements').html(selectionHtml);
}



function processSelectionOfAlternatives() {
	$('#alternativeBehaviorRefinements input').each(function() {
		if (this.checked) {
			flowExpressions[this.name] = this.value;
		}
	})
	deriveXorStates();
	deriveStatechart();
}

var xorStates = [];
function deriveXorStates() {
	var counter = 0;
	var xorState = "";
	var matchesArray = null;
	
	for(i in flowExpressions) {
		xorState = i + '(';
		
		matchesArray = flowExpressions[i].match(idRegex);
		for (j in matchesArray) {
			xorState += matchesArray[j] + ',';
		}
		
		xorState = xorState.substr(0, xorState.lastIndexOf(','));
		xorState += ')';
		xorStates[counter] = xorState;
		counter++;
	}
}