var TYPE_DESIGN_TASK = 'designTask';
goalModel.nodeCreators.designTask = {
	idPrefix: 'dt',
	contentPrefix: 'Design Task ',
	newNodeClass: Joint.dia.goal.DesignTask,
	originOffsetX: -100,
	originOffsetY: 100,
	defaultLinkShape: Joint.dia.goal.andArrow,
	buttons: [1,2,3],
	buttonsInDesign: [1,2,3],
};

var TYPE_DESIGN_CONSTRAINT = 'designConstraint';
goalModel.nodeCreators.designConstraint = {
	idPrefix: 'dq',
	contentPrefix: 'Design Constraint ',
	newNodeClass: Joint.dia.goal.DesignConstraint,
	originOffsetX: -50,
	originOffsetY: 100,
	defaultLinkShape: Joint.dia.goal.andArrow,
	buttons: [1,2,3],
	buttonsInDesign: [1,2,3],
};

var TYPE_DESIGN_ASSUMPTION = 'designAssumption';
goalModel.nodeCreators.designAssumption = {
	idPrefix: 'da',
	contentPrefix: 'Assumption ',
	newNodeClass: Joint.dia.goal.DesignAssumption,
	originOffsetX: -50,
	originOffsetY: 100,
	defaultLinkShape: Joint.dia.goal.andArrow,
	buttons: [3],
	buttonsInDesign: [3],
};

var TYPE_PARAMETER = 'parameter';
goalModel.nodeCreators.parameter = {
	idPrefix: 'p',
	contentPrefix: 'Parameter ',
	newNodeClass: Joint.dia.goal.Parameter,
	originOffsetX: 80,
	originOffsetY: 50,
	defaultLinkShape: Joint.dia.goal.line,
	buttons: []
};

var TYPE_INDICATOR = 'indicator';
goalModel.nodeCreators.indicator = {
	idPrefix: 'ar',
	contentPrefix: 'Indicator ',
	newNodeClass: Joint.dia.goal.Indicator,
	originOffsetX: 50,
	originOffsetY: 50,
	defaultLinkShape: Joint.dia.goal.line,
	buttons: []
};


function hideDesignRefinements() {
	Joint.dia.each(function () {
		if (this.properties.object==TYPE_DESIGN_TASK
			|| this.properties.object==TYPE_DESIGN_CONSTRAINT) {
			
			this.hide(true);
		}
	});
}

function hideQualities() {
	Joint.dia.each(function () {
		if (this.properties.object==goalModel.TYPE_QUALITY
			|| this.properties.object==TYPE_DESIGN_CONSTRAINT
			|| this.properties.object==goalModel.TYPE_ASSUMPTION
			|| this.properties.object==TYPE_DESIGN_ASSUMPTION) {
			
			this.hide(true);
		}
	});
}

function showRequirementsQualities() {
	Joint.dia.each(function () {
		if (this.properties.object==goalModel.TYPE_QUALITY || this.properties.object==goalModel.TYPE_ASSUMPTION) {
			
			this.show(true);
		}
	});
}
function showDesignRefinements(hideQuality) {
	Joint.dia.each(function () {
		if (this.properties.object==TYPE_DESIGN_TASK
			|| (this.properties.object==TYPE_DESIGN_ASSUMPTION && !hideQuality)
			|| (this.properties.object==TYPE_DESIGN_CONSTRAINT && !hideQuality)) {
			
			this.show(true);
		}
	});
}


function createDelegation(node) {
	var bb = node.wrapper.getBBox();
	if (node.innerNoDrag) {
		node.innerNoDrag.delegation = node.paper.text(bb.x+45, bb.y + bb.height+5, node.properties.delegation)
			.attr({'font-size': '12',
				 'text-anchor':'start'});
		node.innerNoDrag.delegationIcon = node.paper.path('M21.021,16.349c-0.611-1.104-1.359-1.998-2.109-2.623c-0.875,0.641-1.941,1.031-3.103,1.031c-1.164,0-2.231-0.391-3.105-1.031c-0.75,0.625-1.498,1.519-2.111,2.623c-1.422,2.563-1.578,5.192-0.35,5.874c0.55,0.307,1.127,0.078,1.723-0.496c-0.105,0.582-0.166,1.213-0.166,1.873c0,2.932,1.139,5.307,2.543,5.307c0.846,0,1.265-0.865,1.466-2.189c0.201,1.324,0.62,2.189,1.463,2.189c1.406,0,2.545-2.375,2.545-5.307c0-0.66-0.061-1.291-0.168-1.873c0.598,0.574,1.174,0.803,1.725,0.496C22.602,21.541,22.443,18.912,21.021,16.349zM15.808,13.757c2.362,0,4.278-1.916,4.278-4.279s-1.916-4.279-4.278-4.279c-2.363,0-4.28,1.916-4.28,4.279S13.445,13.757,15.808,13.757z')
			.attr({fill: "#000", stroke: "none"})
			.translate(bb.x + 15, bb.y + bb.height/2 + 1);
	}

//	console.log(node);

	for (j in node.innerNoDrag) {
		node.innerNoDrag[j].hide();
	}
	return node;
}


function editDelegation() {
	//small trick to handle linebreaks on a javascript prompt
	var newText = window.prompt('This element will be delegated to:', this.properties.delegation.replace(new RegExp( '\n', 'g' ), '.'));  //convert all linebreaks onto a dot
	if (newText != null) {
		newText = newText.replace(new RegExp( '\\.', 'g' ), '\n');  //convert all dots back to linebreak
		this.properties.delegation = newText;
		this.innerNoDrag.delegation.attr('text', newText);
		
		if (newText != '') {
			this.innerNoDrag.delegation.show();
			this.innerNoDrag.delegationIcon.show();
		}
		else {
			this.innerNoDrag.delegation.hide();
			this.innerNoDrag.delegationIcon.hide();
		}
	}
}

function createAnnotation(node) {
	var bb = node.wrapper.getBBox();
	node.innerNoDrag = {
		annotationBg: node.paper.rect(bb.x, bb.y-20, bb.width, 20, 0).attr({ fill: 'white', 'stroke-width': 1 }),
		annotation: node.paper.text(bb.x + bb.width/2, bb.y - 10, node.properties.annotation).attr({'font': '14 "Courier"'}),
		idCircle: node.paper.circle(bb.x+5, bb.y+bb.height-5, 15).attr({ fill: 'white', 'stroke-width': 2 }),
		idLabel: node.paper.text(bb.x+5, bb.y + bb.height-5, node.properties.name).attr({'font': '12 "Arial"'}),
	}

	for (j in node.innerNoDrag) {
		node.innerNoDrag[j].hide();
	}
	return node;
}


function editAnnotation() {
	//small trick to handle linebreaks on a javascript prompt
	var newText = window.prompt('Edit flow expression', this.properties.annotation.replace(new RegExp( '\n', 'g' ), '.'));  //convert all linebreaks onto a dot
	if (newText != null) {
		newText = newText.replace(new RegExp( '\\.', 'g' ), '\n');  //convert all dots back to linebreak
		this.properties.annotation = newText;
		this.innerNoDrag.annotation.attr('text', newText);
		
		if (newText != '') {
			this.innerNoDrag.annotationBg.show();
			this.innerNoDrag.annotation.show();
		}
		else {
			this.innerNoDrag.annotationBg.hide();
			this.innerNoDrag.annotation.hide();
		}
		
		
		//resize the background element of the annotation
		var bb = this.wrapper.getBBox();
		this.innerNoDrag.annotationBg.attr('height', this.innerNoDrag.annotation[0].scrollHeight);
		this.innerNoDrag.annotationBg.attr('width', this.innerNoDrag.annotation[0].scrollWidth);
		this.innerNoDrag.annotationBg.attr('x', bb.x + bb.width/2 - this.innerNoDrag.annotation[0].scrollWidth/2);
		this.innerNoDrag.annotationBg.attr('y', bb.y - this.innerNoDrag.annotation[0].scrollHeight);
		this.innerNoDrag.annotation.attr('y', bb.y - this.innerNoDrag.annotation[0].scrollHeight/2);
	}
}



var combinedAnnotations = '';
var numberOfElements = 0;
function combineAnnotations() {
	combinedAnnotations = '';
	numberOfElements = 0;
	Joint.dia.each(readAnnotation);
	combinedAnnotations += ' ';  //to prevent missing the last element of the annotation when checking with regex
	console.log('combined annotations (without substitution): ' + combinedAnnotations);
}


var flowExpressions = {};
function collectExpressions() {
	flowExpressions = {};
	Joint.dia.each(readAnnotation);
}

var combinedExpressions = '';
function combineExpressions() {
	combinedExpressions = '';
	//Joint.dia.each(readAnnotation);
	
	combinedExpressions = getSubexpression(flowExpressions['g1']);
	console.log('combined annotations (with substitution): ' + combinedExpressions);
}

var idRegex = new RegExp( '[A-z]+[0-9]+', 'g' );
function getSubexpression(expression) {
	var result = expression;
	
	//var idRegex = new RegExp( '[A-z]+[0-9]+', 'g' );
	var matchesArray = expression.match(idRegex);
	for (i in matchesArray) {
		if (flowExpressions[matchesArray[i]]) {
			result = result.replace(matchesArray[i], 
				'(' + getSubexpression(flowExpressions[matchesArray[i]]) + ')'
			);
		}
		else {
			//result += matchesArray[i];
		}
		
	}
	
	return result;
}


function readAnnotation(store) {
	numberOfElements++;
	if (this.properties.annotation) {
		combinedAnnotations += ' ' + this.properties.annotation;
		flowExpressions[this.properties.name] = this.properties.annotation;
	}
}
function processAnnotations() {
	var warnings = [];
	missingTaskWarning = '';
	
	combineAnnotations();
	findUnrefinedGoals();
	findLeafTasks();
	
	if (unrefinedGoals.length > 0) {
		unrefinedGoalsWarning = 'the following goals were not refined: ';
		for (i in unrefinedGoals) {
			unrefinedGoalsWarning += '\'(' + unrefinedGoals[i].properties.name + ') ' + unrefinedGoals[i].properties.content + '\' ';
			unrefinedGoals[i].highlightTimed();
			
		}
		warnings.push({text:unrefinedGoalsWarning, count:unrefinedGoals.length});
	}
	
	//check if all leaf tasks were included in the flow expression
	var numberOfTasksNotIncluded = 0;
	for (i in leafTasks) {
		var reg = new RegExp('(\\s|\\(|:|\\|)'+leafTasks[i].properties.name+'(\\s|\\)|:|\\+|\\*|\\?|\\|)+');
		if (! reg.test(combinedAnnotations)) {
			//this task was not found in the combined flow expression
			missingTaskWarning += '\'(' + leafTasks[i].properties.name + ') ' + leafTasks[i].properties.content + '\' ';
			leafTasks[i].highlightTimed();
			numberOfTasksNotIncluded++;
		}
	}
	
	if (numberOfTasksNotIncluded > 0) {
		warnings.push({text: 'the following tasks were not included in the flow expression: ' + missingTaskWarning, 
			count: numberOfTasksNotIncluded});
	}
	warnings.push({text: 'number of elements', count: numberOfElements, type: 'info'});
	console.log(warnings);
	displayWarning(warnings);

	//clean up
	unrefinedGoals = [];
	leafTasks = [];
	
	return warnings;
}

//display a array of warning in a alerts div
function displayWarning(warnings) {
	var alertHtml = '';
	if (warnings.length > 0) {
		for (i in warnings) {
			if (warnings[i].type=='info') {
				alertHtml += '<div class="alert alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button>';
				if (warnings[i].count) {
					alertHtml += '<span class="badge">' + warnings[i].count + '</span>';
				}
				alertHtml += '<strong> Info: </strong> '	+ warnings[i].text + '</div>';
			}
			else {
				alertHtml += '<div class="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>';
				if (warnings[i].count) {
					alertHtml += '<span class="badge badge-important">' + warnings[i].count + '</span>';
				}
				alertHtml += '<strong> Warning!</strong> '	+ warnings[i].text + '</div>';
			}
		}
		
	}
	else {
		alertHtml += '<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Well done!</strong> '
				+ ' no problem found</div>';
	}
	$('#alerts').html(alertHtml);
}

function displayInfo(info) {
	var alertHtml = '';
	if (info.length > 0) {
		for (i in info) {
			alertHtml += '<div class="alert alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button>';
			if (info[i].count) {
				alertHtml += '<span class="badge badge-important">' + info[i].count + '</span>';
			}
			alertHtml += '<strong> Info: </strong> '	+ info[i].text + '</div>';
		}
		
	}
	else {
		alertHtml += '<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Well done!</strong> '
				+ ' no problem found</div>';
	}
	$('#alerts').html(alertHtml);

}

function displaySimpleWarning(message) {
	var alertHtml = '<div class="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>'+ message +'</div>';
	
	$('#alerts').html(alertHtml);

}

goalModel.old_createChildNode = goalModel.createChildNode;
goalModel.createChildNode = function (nodeProperties, nodeCreator, parent) {
	if (goalModel.mode === goalModel.MODE_REQUIREMENTS) {
		goalModel.old_createChildNode(nodeProperties, nodeCreator, parent);
	}
	else if (goalModel.mode === goalModel.MODE_DESIGN) {
		if (Joint.dia.goal.Task == nodeCreator.newNodeClass) {
			goalModel.old_createChildNode(nodeProperties, goalModel.nodeCreators.designTask, parent);
		}
		else if (Joint.dia.goal.Quality == nodeCreator.newNodeClass) {
			goalModel.old_createChildNode(nodeProperties, goalModel.nodeCreators.designConstraint, parent);
		}
		else if (Joint.dia.goal.DomainAssumption == nodeCreator.newNodeClass) {
			goalModel.old_createChildNode(nodeProperties, goalModel.nodeCreators.designAssumption, parent);
		}
		else {
			goalModel.old_createChildNode(nodeProperties, nodeCreator, parent);
		}
	}
}; 
