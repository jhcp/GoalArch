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
			
			// generate textual statechart description /////////////////////////////
			var text = '<b>Super states (XOR):</b> ';
			var xorStatesString = ''
			for (i in xorStates) {
				xorStatesString += xorStates[i] + ', ';
			}
			xorStatesString = xorStatesString.substr(0, xorStatesString.lastIndexOf(','));
			text += xorStatesString;
			
			text += '<br /><br /><b>Atomic states:</b> ';
			for (i in data.atomicStates) {
				text += data.atomicStates[i] + ', ';
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
			console.log('TRANSITIONS:\n' + transitionsText);
			
			$('#statechart').html(text);
			///////////////////////////////////////////////////////////////////////////////////////
			
						
			// generate statechart diagram ///////////////////////////////////
			//replace start state name with the Mermaid symbol for start states
			for (j = 0; j < transitions.length; j++) {
				transitions[j] = transitions[j].replace('[start]', '[*]');
			}
			
			//create list of state names
			var stateNames = '';
			Joint.dia.each(function() {
				//currently (v8.9.1) the mermaid js does not support descriptive names for composite states - see https://github.com/mermaid-js/mermaid/issues/1284
				//once that is supported we may be able to support displaying the names of the composite states, instead of just the id
				//to that end, the condition below can be extended to include the names of XOR states: || xorStatesString.includes(this.properties.name)
				if ( data.atomicStates.includes(this.properties.name) ) {
					cleanStateName = this.properties.content.replace('\:', '').replace('\n', '');
					stateNames += this.properties.name + ' : (' + this.properties.name + ') ' + cleanStateName + '\n';
				}
			});
			
			var superStatesString = '';
			for (j = xorStates.length - 1; j >= 0; j--) {
				var parent = xorStates[j].substr(0, xorStates[j].indexOf('('));
				var children = xorStates[j].substr(xorStates[j].indexOf('(') + 1, xorStates[j].length - xorStates[j].indexOf('(') - 2).split(',');
				superStatesString += 'state ' + parent + '{\n';
				for (k = 0; k < children.length; k++) {
					superStatesString += children[k] + '\n'
				}
				superStatesString += '}\n';
			}
			
			//this CSS style prevents wrong formatting of the labels when saving the statechart as an image
			var graphDefinition = '%%{init: {"themeCSS": ".label foreignObject { font-size: 14px; overflow: visible;}"}}%%\nstateDiagram-v2\n';
			for (j in transitions) {
				graphDefinition += transitions[j] + '\n';
			}
			graphDefinition += stateNames;
			graphDefinition += superStatesString;
			var graph = mermaid.mermaidAPI.render('graphDiv', graphDefinition, function(svg) {
				$('#statechartDiagram').html(svg);
			});
			
			///////////////////////////////////////////////////////////////////////////////////////
			
			
			//replace states ids for their names, for the benefit of the "Transitions" tab
			Joint.dia.each(function() {
				for (j in transitions) {
					transitions[j] = transitions[j].replace(new RegExp( this.properties.name, 'g' ), '(' + this.properties.name + ') ' + this.properties.content);
					transitions[j] = transitions[j].replace(new RegExp( '\\n', 'g' ), ' ');
				}
			});
			

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