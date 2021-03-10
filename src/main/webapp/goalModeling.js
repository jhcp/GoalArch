(function(global) {
//SETUP VARS
var dragStartPosition = null;
var highlightedNode = null;
var previouslyHighlightedNode = null;
var paper = Joint.paper('world');

var goalModel = function (){
	
	this.elementCounter = 0;
	this.contextCounter = 0;
	this.MODE_REQUIREMENTS = 0;
	this.mode = this.MODE_REQUIREMENTS;
	
	this.changedModel = true;
	
	this.nodeCreators = {};
	
	//the following lines setup the creation of each model element.
	// the idPrefix (string) is used to create an id for that kind of element, in the form idX. For instance, if the idPrefix for a goal is 'g', the first goal will be 'g1', the second goal will be 'g2', and so on.
	// the contentPrefix (string) is used to define the initial text of an element when it is created. For instance, considering the contentPrefix 'Goal ', the first goal will have 'Goal 1' as its inner text, the second goal will have 'Goal 2' as its inner text, and so on
	// the newNodeClass (object) represents the shape of that element, using the objects defined in the Joint.dia.goal object (file joint.goal.js)
	// the x and y origin offset (integer) are used to define the intial position for that kind of element, w.r.t. its parent. For instance, an element with originOffsetX: -50 and originOffsetY: 100, it will be initially placed 50 pixels to the left and 100 pixels below the center of its parent.
	// defaultLinkShape (object) defines the kind of link to use when creating children of that element, using the objects defined in the Joint.dia.goal object (file joint.goal.js)
	// 
	
	this.TYPE_GOAL = 'goal';
	this.nodeCreators.goal = {
		idPrefix: 'g',
		contentPrefix: 'Goal ',
		newNodeClass: Joint.dia.goal.Goal,
		defaultLinkShape: Joint.dia.goal.andArrow, 
		originOffsetX: -50, 
		originOffsetY: 100, 
		buttons: [0,1,2,3], 
		buttonsInDesign: [1,2,3,4,5], 
	};
	
	this.TYPE_TASK = 'task';
	this.nodeCreators.task = {
		idPrefix: 't',
		contentPrefix: 'Task ',
		newNodeClass: Joint.dia.goal.Task,
		defaultLinkShape: Joint.dia.goal.andArrow,
		originOffsetX: -90,
		originOffsetY: 100,
		buttons: [2,3],
		buttonsInDesign: [1,2,3,4,5],
	};
	
	this.TYPE_QUALITY = 'quality';
	this.nodeCreators.quality = {
		idPrefix: 'q',
		contentPrefix: 'Quality ',
		newNodeClass: Joint.dia.goal.Quality,
		defaultLinkShape: Joint.dia.goal.andArrow,
		originOffsetX: -50,
		originOffsetY: 100,
		buttons: [1,2,3],
		buttonsInDesign: [1,2,3,4,5],
	};
	
	this.TYPE_ASSUMPTION = 'domainAssumption';
	this.nodeCreators.domainAssumption = {
		idPrefix: 'a',
		contentPrefix: 'Assumption ',
		newNodeClass: Joint.dia.goal.DomainAssumption,
		defaultLinkShape: Joint.dia.goal.andArrow,
		originOffsetX: -50,
		originOffsetY: 100,
		buttons: [3],
		buttonsInDesign: [3,4,5],
	};
	this.TYPE_SOFTGOAL = 'softgoal';
	this.nodeCreators.softgoal = {
		idPrefix: 's',
		contentPrefix: 'Softgoal ',
		newNodeClass: Joint.dia.goal.Softgoal,
		defaultLinkShape: Joint.dia.goal.andArrow,
		originOffsetX: -50,
		originOffsetY: 100,
		buttons: [2],
		buttonsInDesign: [2],
	};
	
	this.addGoalButton = {
		filename: 'images/ui-addGoalButton-28x26.png',
		action: this.TYPE_GOAL,
	};
	this.addTaskButton = {
		filename: 'images/ui-addTaskButton-28x26.png',
		action: this.TYPE_TASK,
	};
	this.addQualityButton = {
		filename: 'images/ui-addQualityButton-28x26.png',
		action: this.TYPE_QUALITY,
	};
	this.addAssumptionButton = {
		filename: 'images/ui-addAssumptionButton-28x26.png',
		action: this.TYPE_ASSUMPTION,
	};
	
};

goalModel.prototype = {
	
	clearPaper: function () {
		Joint.dia.hardReset();
		this.elementCounter = 0;
		createButtons();
		
		this.createStandaloneNode({x:305,y:70}, this.nodeCreators.goal, 'g1');
	},
	
	getSize: function() {
		return {width: paper.width, height: paper.height};
	},
	resizePaper: function (width, height) {
		Joint.paper().setSize(width, height);
		$('#world').width(width);
		$('#world').height(height);
	},
	
	createChildNode: function(nodeProperties, nodeCreator, parent) {
		var newNode = null;
		
		
		this.elementCounter++;
		var content = nodeCreator.contentPrefix + this.elementCounter;
		newNode = nodeCreator.newNodeClass.create({
			rect: { 
				x: (parent ? parent.properties.rect.x + parent.properties.dx + nodeCreator.originOffsetX + (((this.elementCounter - 2) % 5) * 50): nodeCreator.originOffsetX),
				y: (parent ? parent.properties.rect.y + parent.properties.dy + nodeCreator.originOffsetY + (((this.elementCounter - 2) % 5) * 10): nodeCreator.originOffsetY),
				width: 130, height: 35
			},
			name: nodeCreator.idPrefix + this.elementCounter,
			content: content,
			annotation: (nodeProperties ? (nodeProperties.annotation || '') : ''),
			delegation: (nodeProperties ? (nodeProperties.delegation || '') : ''),
		});

		global.goalModel.setupUiForNode.call(newNode, nodeCreator);
		createAnnotation(newNode);  //TODO strips this away
		createDelegation(newNode);  //TODO strips this away
		
		if (parent) {
			parent.joint(newNode, nodeCreator.defaultLinkShape);
		}
		return newNode;
	},
	createStandaloneNode: function(nodeProperties, nodeCreator, id) {
		var content = nodeProperties.content || 'New Node' ;
		var newNode = null;
		
		this.elementCounter++;
		content = nodeCreator.contentPrefix + this.elementCounter;
		newNode = nodeCreator.newNodeClass.create({
			rect: { 
				x: nodeProperties.x,
				y: nodeProperties.y,
				width: 130, height: 35
			},
			name: id,
			content: content,
			annotation: nodeProperties.annotation || '',
			delegation: nodeProperties.delegation || '',
		});

		global.goalModel.setupUiForNode.call(newNode, nodeCreator);
		createAnnotation(newNode);  //TODO strips this away
		createDelegation(newNode);  //TODO strips this away
		return newNode;
	},
	
	editNode: function() {
		//small trick to handle linebreaks on a javascript prompt
		
		var newText = window.prompt('Edit text - use a dot (.) for line breaks', this.properties.content.replace(new RegExp( '\n', 'g' ), '.'));  //convert all linebreaks onto a dot
		if (newText != null) {
			newText = newText.replace(new RegExp( '\\.', 'g' ), '\n');  //convert all dots back to linebreak
			this.changeLabel(newText);
		}
	},
	deleteNode: function() {
		//first confirm if the user really want to delete the nodeName
		//if confirmed, then delete it
		//else, nothing happens
		
		var confirmed = window.confirm("Are you sure you want to delete \"" + this.properties.content + "\"?");
		if (confirmed) {
			this.liquidate();
		}
	},
	toggleRefinement: function() {
		for (i in this.joints()) {
			j = this.joints()[i];
			if (j.startObject()==this.wrapper && j._opt.attrs.object != 'line') {
				if (j._opt.arrow.start.attrs.fill == 'black') {
					j._opt.arrow = {
						start: Joint.getArrow('basic', 5, {fill: 'white'}),
						end: Joint.getArrow('none', 5)
					};
					j._opt.attrs.object = 'orArrow';
				}
				else {
					j._opt.arrow = {
						start: Joint.getArrow('basic', 5, {fill: 'black'}),
						end: Joint.getArrow('none', 5)
					};
					j._opt.attrs.object = 'andArrow';
				}
				
				j.redraw();
			}
		}
	},
	setContext: function() {
		for (i in this.joints()) {
			j = this.joints()[i];
			if (j.endObject()==this.wrapper && j._opt.attrs.object != 'line') {
				global.goalModel.contextCounter++;
				j.label('C' + global.goalModel.contextCounter);			
				//j.redraw();
			}
		}
	},
	
	setupUiForNode: function(nodeCreator) {
		//create UI elements for this node
		this.actions = nodeCreator.buttons;
		this.actionsInDesign = nodeCreator.buttonsInDesign;
		this.innerNoDrag = [];
			
		this.wrapper.hover(nodeHoverIn, nodeHoverOut);
		this.wrapper.drag(
			function(dx,dy,x,y,e){},	//onmove
			dragStart,		//onstart
			dragEnd
		);
		
		this.inner[0].hover(nodeHoverIn, nodeHoverOut);
		this.inner[0].drag(
			function(dx,dy,x,y,e){},	//onmove
			dragStart,		//onstart
			dragEnd		//onend
		); 

		return this;
	}


};

global.goalModel = new goalModel();



function nodeHoverIn()
{
	if(dragStartPosition==null) {		//this condition prevents showing buttons during dragging
		
		global.goalModel.highlightedNode = this.wholeShape;
		
		if ((global.goalModel.mode==global.goalModel.MODE_REQUIREMENTS || global.goalModel.mode == global.goalModel.MODE_DESIGN )) {
			var actions = null;
			if (global.goalModel.mode === global.goalModel.MODE_DESIGN) {
				actions = global.goalModel.highlightedNode.actionsInDesign;
			}
			else {
				actions = global.goalModel.highlightedNode.actions;
			}
			
			if (this[0].nodeName == 'text' && !(this.wholeShape.properties.object == 'indicator')) {	
				//if it is a text (label) we don't need to update the position, since the labels reside inside a shape.
				//unless the node is an indicator, which do not reside inside a shape
				for (i in actions) {
					global.hoverButtons[actions[i]].show();
					global.hoverButtons[actions[i]].toFront();
				}
			} else {
				var buttonsCount = 1;
				for (i in actions) {
					global.hoverButtons[actions[i]].attr({x: this.wholeShape.wrapper.getBBox().x -40 + 30*buttonsCount});
					global.hoverButtons[actions[i]].attr({y: this.wholeShape.wrapper.getBBox().y + this.wholeShape.wrapper.getBBox().height - 12});
					global.hoverButtons[actions[i]].show();
					global.hoverButtons[actions[i]].toFront();
					buttonsCount++;
				}
			}
			
		}
	}
}
function nodeHoverOut()
{
	if(dragStartPosition==null) {
		if (global.goalModel.mode==global.goalModel.MODE_REQUIREMENTS || global.goalModel.mode == global.goalModel.MODE_DESIGN) {
			for (i in hoverButtons) {
				hoverButtons[i].hide();
			}
		}
		//global.goalModel.highlightedNode = null;
	}
}
function dragStart(x,y,e){
	for (i in hoverButtons) {
		hoverButtons[i].hide();
	}
	//dragStartPosition = {'x': e.x | e.clientX, 'y': e.y | e.clientY};
	dragStartPosition = {'x': this.wholeShape.wrapper.getBBox().x, 'y': this.wholeShape.wrapper.getBBox().y};
}


function dragEnd(e){
	//var target = {'x': e.x | e.clientX, 'y': e.y | e.clientY};
	var target = {'x': this.wholeShape.wrapper.getBBox().x, 'y': this.wholeShape.wrapper.getBBox().y};
	var delta = {'x': target.x - dragStartPosition.x, 'y': target.y - dragStartPosition.y};

	if (global.goalModel.highlightedNode._opt.draggable) {
		var actions = global.goalModel.highlightedNode.actions;
		
		for (i in actions) {
			hoverButtons[actions[i]].attr({
				x: (hoverButtons[actions[i]].attrs.x + delta.x),
				y: (hoverButtons[actions[i]].attrs.y + delta.y),
			});
			if (global.goalModel.mode != global.goalModel.MODE_ANNOTATION && global.goalModel.mode != global.goalModel.MODE_DELEGATION) {
				hoverButtons[actions[i]].toFront();
				hoverButtons[actions[i]].show();
			}
		}
		for (i in global.goalModel.highlightedNode.innerNoDrag) {
			global.goalModel.highlightedNode.innerNoDrag[i].translate(delta.x, delta.y);
			global.goalModel.highlightedNode.innerNoDrag[i].toFront();
		}
	}
	
	
	dragStartPosition = null;
}	


}(this));




var hoverButtons = [];
function createButtons() {
	hoverButtons = [];
	hoverButtons.push(createAddButton(goalModel.addGoalButton, 1));
	hoverButtons.push(createAddButton(goalModel.addTaskButton, 2));
	hoverButtons.push(createAddButton(goalModel.addQualityButton, 3));
	hoverButtons.push(createAddButton(goalModel.addAssumptionButton, 4));
	hoverButtons.push(createAddButton(goalModel.addIndicatorButton, 5));
	hoverButtons.push(createAddButton(goalModel.addParameterButton, 6));
	
	return this;
}

function createAddButton( button, position) {
	var addButton = null;
		
	addButton = Joint.paper().image(
		button.filename,
		position*32, 0,
		28, 26
	);
	
	addButton.action = button.action;
	addButton.click(function(){
		goalModel.createChildNode(null, goalModel.nodeCreators[this.action], goalModel.highlightedNode);
		//goalModel.addFunctions[this.action](goalModel.highlightedNode);
	});
	
	addButton.hover(function(){this.show();}, function(){this.hide();});
	addButton.hide();
	
	return addButton;
}


$(document).ready(function () {
	createButtons();
	
	//CREATE BASIC MODEL
	var goal = goalModel.createStandaloneNode({x:305,y:50, annotation:''}, goalModel.nodeCreators.goal, 'g1');
	goal.changeLabel('Hi, I\'m a goal!\nPoint at me =)');
	//var t1 = goalModel.createStandaloneNode({x:500,y:120, annotation:'dt8|dt9'}, goalModel.nodeCreators.task, 't1'); t1.changeLabel('Bake');	
	//var joint = goal.joint(t1, Joint.dia.goal.andArrow);
	//joint._opt.label="opa";
	//joint.label(0, { attrs: { text: { text: 'my label' } } })
	//joint.label('teste');
	/*
	var g1 = goalModel.createStandaloneNode({x:305,y:20, annotation:'g2 g3? t4'}, goalModel.nodeCreators.goal, 'g1'); g1.changeLabel('Make Pizza');
	var g2 = goalModel.createStandaloneNode({x:90,y:120, annotation:'t6 t7'}, goalModel.nodeCreators.goal, 'g2'); g2.changeLabel('Make Dough');	
	var g3 = goalModel.createStandaloneNode({x:300,y:120, annotation:''}, goalModel.nodeCreators.goal, 'g3'); g3.changeLabel('Make Topping');	
	var t1 = goalModel.createStandaloneNode({x:500,y:120, annotation:'dt8|dt9'}, goalModel.nodeCreators.task, 't1'); t1.changeLabel('Bake');	
	var q1 = goalModel.createStandaloneNode({x:350,y:220}, goalModel.nodeCreators.quality, 'q1'); q1.changeLabel('Good taste');	
	var t2 = goalModel.createStandaloneNode({x:50,y:220}, goalModel.nodeCreators.task, 't2'); t2.changeLabel('Mix flour,\n water and yeast');
	var t3 = goalModel.createStandaloneNode({x:200,y:240, delegation:'Assistent'}, goalModel.nodeCreators.task, 't3'); t3.changeLabel('Let it grow');
	var dt1 = goalModel.createStandaloneNode({x:500,y:220}, goalModel.nodeCreators.designTask, 'dt1'); dt1.changeLabel('Use regular oven');	
	var dt2 = goalModel.createStandaloneNode({x:620,y:180}, goalModel.nodeCreators.designTask, 'dt2'); dt2.changeLabel('Use industrial oven');	
	var p1 = goalModel.createStandaloneNode({x:530,y:160}, goalModel.nodeCreators.parameter, 'p1'); p1.changeLabel('NoR');
	var ar1 = goalModel.createStandaloneNode({x:120,y:80}, goalModel.nodeCreators.indicator, 'ar1'); ar1.changeLabel('AR1:Never fail');
	var ar2 = goalModel.createStandaloneNode({x:580,y:90}, goalModel.nodeCreators.indicator, 'ar2'); ar2.changeLabel('AR2:Never fail');
	
	g1.joint(g2, Joint.dia.goal.andArrow);
	g1.joint(g3, Joint.dia.goal.andArrow);//.setVertices(['100 50']).toggleSmoothing();
	g1.joint(t1, Joint.dia.goal.andArrow);
	g2.joint(t2, Joint.dia.goal.andArrow);
	g2.joint(t3, Joint.dia.goal.andArrow);
	g3.joint(q1, Joint.dia.goal.andArrow);	 
	t1.joint(dt1, Joint.dia.goal.orArrow);	 
	t1.joint(dt2, Joint.dia.goal.orArrow);	 
	
	t1.joint(p1, Joint.dia.goal.line);	
	t1.joint(ar2, Joint.dia.goal.line);	
	g2.joint(ar1, Joint.dia.goal.line);	
	*/

	// diagramManager.changeToRequirements();
	//diagramManager.changeToDesign();//jump to design, just for facilitating testing
	console.log('Hi there! This is a prototype tool. Please be gentle =)');
	console.log('Feel free to check out the source code. However, if you plan on using it or extending it, please contact me, I\'ll be glad to help.');
	console.log('For contact info, please go to github.com/jhcp/GoalArch');
	console.log('');
});


//keyboard shortcuts
$(document).keypress(function(e) {
	if (goalModel.highlightedNode!=null) {
		if (goalModel.mode === goalModel.MODE_REQUIREMENTS) {
			//edit content of the element
			if (e.which==69 || e.which==101) {  //E or e
				goalModel.editNode.call(goalModel.highlightedNode);
			}
			
			//add new elements
			else if (e.which==71 || e.which==103) {  //G or g
				goalModel.createChildNode(null, goalModel.nodeCreators[goalModel.TYPE_GOAL], goalModel.highlightedNode);
			}
			else if (e.which==84 || e.which==116) {  //T or t
				goalModel.createChildNode(null, goalModel.nodeCreators[goalModel.TYPE_TASK], goalModel.highlightedNode);
			}
			else if (e.which==81 || e.which==113) {  //Q or q
				goalModel.createChildNode(null, goalModel.nodeCreators[goalModel.TYPE_QUALITY], goalModel.highlightedNode);
			}
			else if (e.which==65 || e.which==97) {  //A or a
				goalModel.createChildNode(null, goalModel.nodeCreators[goalModel.TYPE_ASSUMPTION], goalModel.highlightedNode);
			}
			
			
			else if (e.which==83 || e.which==115) {  //S or s
				goalModel.createChildNode(null, goalModel.nodeCreators[goalModel.TYPE_SOFTGOAL], goalModel.highlightedNode);
			}
			else if (e.which==49) {  //1
				if (goalModel.previouslyHighlightedNode == null) {
					goalModel.previouslyHighlightedNode = goalModel.highlightedNode;
				} else {
					goalModel.highlightedNode.joint(goalModel.previouslyHighlightedNode, Joint.dia.goal.hurt);
					goalModel.previouslyHighlightedNode = null;
				}
				//goalModel.createChildNode(null, goalModel.nodeCreators[goalModel.TYPE_GOAL], goalModel.highlightedNode);
			}
			else if (e.which==50) {  //2
				if (goalModel.previouslyHighlightedNode == null) {
					goalModel.previouslyHighlightedNode = goalModel.highlightedNode;
				} else {
					goalModel.highlightedNode.joint(goalModel.previouslyHighlightedNode, Joint.dia.goal.help);
					goalModel.previouslyHighlightedNode = null;
				}
				//goalModel.createChildNode(null, goalModel.nodeCreators[goalModel.TYPE_GOAL], goalModel.highlightedNode);
			}
			else if (e.which==67 || e.which==99) {  //C or C
				goalModel.setContext.call(goalModel.highlightedNode);
			}
			
			
			else if (e.which==66 || e.which==98) {  //B or b
				goalModel.highlightedNode.toggleGhosting();
			}
			
			//toggle between AND/OR refinement
			else if (e.which==79 || e.which==111) {  //O or o
				goalModel.toggleRefinement.call(goalModel.highlightedNode);
			}
			//delete element
			else if (e.which==68 || e.which==100) {  //D or d
				goalModel.deleteNode.call(goalModel.highlightedNode);
				//goalModel.highlightedNode.liquidate();
			}
			
		}
		goalModel.changedModel = true;
	}
});


var leafTasks;
function findLeafTasks() {
	leafTasks = [];
	Joint.dia.each(isLeafTask);
}
function isLeafTask() {
	if (this.properties.object==goalModel.TYPE_TASK
	   || this.properties.object==TYPE_DESIGN_TASK) {
		
		var hasChildren = false;
		for (i in this.joints()) {
			j = this.joints()[i];
			if (j.startObject()==this.wrapper) {
				if ( !( j.endObject().wholeShape.properties.object == goalModel.TYPE_QUALITY)
				&& !(j.endObject().wholeShape.properties.object == TYPE_DESIGN_CONSTRAINT)) {
					hasChildren = true;
				}				
			}
		}
		
		if (!hasChildren) {
			leafTasks.push(this);
		}
		
		
	}
}

var unrefinedGoals;
function findUnrefinedGoals() {
	unrefinedGoals = [];
	Joint.dia.each(isUnrefinedGoal);
}
function isUnrefinedGoal() {
	if (this.properties.object==goalModel.TYPE_GOAL) {
		var isRefined = false;
		for (i in this.joints()) {
			j = this.joints()[i];
			if (j.startObject()==this.wrapper) {
				//if the node has children that is not a quality, then it is refined
				if ( !( j.endObject().wholeShape.properties.object == goalModel.TYPE_QUALITY)
				&& !(j.endObject().wholeShape.properties.object == TYPE_DESIGN_CONSTRAINT)) {
					isRefined = true;
				}
			}
		}
		
		if (!isRefined) {
			unrefinedGoals.push(this);
		}
		
	}
}

function zoom() {
	document.getElementsByTagName("svg")[0].setAttribute("viewBox", "0 0 700 700");
}