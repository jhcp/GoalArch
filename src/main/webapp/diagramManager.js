$(document).ready(function () {
	goalModel.MODE_DESIGN = 1;
	goalModel.MODE_DELEGATION = 2;
	goalModel.MODE_ANNOTATION = 3;
	goalModel.MODE_DERIVATION = 4;
	goalModel.MODE_ADAPTATION = 5;
	goalModel.MODE_TRANSITIONS = 6;
});

(function(global) {
	var views = [
		{	name:'requirements',
			elements: [goalModel.TYPE_GOAL, goalModel.TYPE_TASK, goalModel.TYPE_QUALITY, goalModel.TYPE_ASSUMPTION, goalModel.TYPE_SOFTGOAL]
		},
		{	name:'design',
			elements: [goalModel.TYPE_GOAL, goalModel.TYPE_TASK, goalModel.TYPE_QUALITY, goalModel.TYPE_ASSUMPTION, goalModel.TYPE_SOFTGOAL,
				TYPE_DESIGN_TASK, TYPE_DESIGN_CONSTRAINT, TYPE_DESIGN_ASSUMPTION]
		},
		{	name:'delegation',
			elements: [goalModel.TYPE_GOAL, goalModel.TYPE_TASK, goalModel.TYPE_QUALITY, goalModel.TYPE_ASSUMPTION, goalModel.TYPE_SOFTGOAL,
				TYPE_DESIGN_TASK, TYPE_DESIGN_CONSTRAINT, TYPE_DESIGN_ASSUMPTION],
			annotations: {assignment: true}
		},
		{	name:'behavior',
			elements: [goalModel.TYPE_GOAL, goalModel.TYPE_TASK, goalModel.TYPE_QUALITY, goalModel.TYPE_ASSUMPTION, goalModel.TYPE_SOFTGOAL,
				TYPE_DESIGN_TASK, TYPE_DESIGN_CONSTRAINT, TYPE_DESIGN_ASSUMPTION],
			annotations: {flowExpression: true}
		},
		{	name:'derivation',
			elements: []
		},
		{	name:'adaptation',
			elements: []
		}
	];
	var showIds = false;
	var showAdaptationElements = false;
	var indicators = [];
	var parameters = [];


	var diagramManager = {
		changeView: function (viewNumber) {
			goalModel.mode = viewNumber;
			Joint.dia.each(function () {
				if (this.properties.object != 'indicator' && this.properties.object != 'parameter') {
					//only show those elements contained in the elements array for the given view. Hide all others
					if (views[viewNumber].elements.indexOf(this.properties.object) === -1) {
						if (this.wrapper.node.style.display != "none") {
							this.hide(true);
						}
					}
					else {
						if (this.wrapper.node.style.display == "none") {
							this.show(true);
						}
					}
				}
				
				//sets annotations
				for (i in this.innerNoDrag) {
						this.innerNoDrag[i].hide();
					}
				if (views[viewNumber].annotations) {
					if (views[viewNumber].annotations.assignment) {
						if (this.properties.delegation && this.properties.delegation!='') {
							this.innerNoDrag.delegation.show();
							this.innerNoDrag.delegationIcon.show();
						}
					}
					if (views[viewNumber].annotations.flowExpression) {
						if (this.properties.annotation && this.properties.annotation!='') {
							this.innerNoDrag.annotation.show();
							this.innerNoDrag.annotationBg.show();
						}
					}
				}
			});
		},
		changeToRequirements: function () {
			diagramManager.changeView(goalModel.MODE_REQUIREMENTS);
			//goalModel.addTaskButton.action = goalModel.TYPE_TASK;
			hoverButtons[1].action = goalModel.TYPE_TASK;
			goalModel.addQualityButton.action = goalModel.TYPE_TASK;
			goalModel.addAssumptionButton.action = goalModel.TYPE_ASSUMPTION;
		},
		changeToDesign: function () {
			diagramManager.changeView(goalModel.MODE_DESIGN);
			//goalModel.addTaskButton.action = goalModel.TYPE_DESIGN_TASK;
			//hoverButtons[1].action = goalModel.TYPE_DESIGN_TASK;
			goalModel.addQualityButton.action = goalModel.TYPE_DESIGN_CONSTRAINT;
		},
		changeToDelegation: function () {
			diagramManager.changeView(goalModel.MODE_DELEGATION);
			goalModel.addTaskButton.action = goalModel.TYPE_DESIGN_TASK;
			goalModel.addQualityButton.action = goalModel.TYPE_DESIGN_CONSTRAINT;
		},
		changeToAnnotation: function () {
			diagramManager.changeView(goalModel.MODE_ANNOTATION);

			Joint.dia.each(function (){
				if (
				   this.properties.object != 'indicator'
				   && this.properties.object != 'parameter'
				   && this.properties.object != 'quality' 
				   && this.properties.object != 'designConstraint'
				   && this.properties.object != 'domainAssumption' 
				   && this.properties.object != 'designAssumption') {
					this.innerNoDrag.idCircle.show();
					this.innerNoDrag.idLabel.show();
				}
			});
		},
		changeToDerivation: function () {
			goalModel.mode = goalModel.MODE_DERIVATION;
			
			if (goalModel.changedModel) {
				$('#combinedExpression').html('');
				$('#statechart').html('');
				listAlternativeBehaviorRefinements();
				goalModel.changedModel = false;
			}
		},
		toggleViewIds:  function () {
			showIds = !showIds;
			Joint.dia.each(function (){
				//only show/hide the ids of visible elements
				if (this.wrapper.node.style.display != "none") {
					if (this.innerNoDrag && this.innerNoDrag.idCircle) {
						if (showIds) {
							this.innerNoDrag.idCircle.show();
							this.innerNoDrag.idLabel.show();
						}
						else
						{
							this.innerNoDrag.idCircle.hide();
							this.innerNoDrag.idLabel.hide();
						}
					}
				}
			});
		},
		isShowAdaptationElements: function () {
			return showAdaptationElements;
		},
		toggleViewAdaptationElements:  function () {
			showAdaptationElements = !showAdaptationElements;
			Joint.dia.each(function (){
				if (this.properties.object === TYPE_INDICATOR || this.properties.object === TYPE_PARAMETER) {
					if (showAdaptationElements && this.wrapper.node.style.display == "none") {
						this.show(true);
					}
					else if (!showAdaptationElements && this.wrapper.node.style.display != "none") {
						this.hide(true);
					}
				}
			});
		},
		listIndicators:  function () {
			indicators = [];
			Joint.dia.each(function (node, index){
				if (this.properties.object === TYPE_INDICATOR) {
					indicators.push({
						name: this.properties.content,
						adaptationStrategy: (this.properties.adaptationStrategy ? this.properties.adaptationStrategy : ''),
						index: index
					});
				}
			});
			return indicators.sort(sortObjectsByName);
		},
		setIndicatorAdaptationStrategy: function (index, content) {
			Joint.dia.getElementByIndex(index).properties.adaptationStrategy = content;
		},
		listParameters:  function () {
			parameters = [];
			Joint.dia.each(function (node, index){
				if (this.properties.object === TYPE_PARAMETER) {
					parameters.push({
						name: this.properties.content,
						range: (this.properties.range ? this.properties.range : ''),
						index: index
					});
				}
			});
			return parameters.sort(sortObjectsByName);
		},
		setParameterRange: function (index, content) {
			Joint.dia.getElementByIndex(index).properties.range = content;
		},
		saveModel: function() {
			var size = goalModel.getSize();
			var modelJson = {width: size.width, height: size.height, elements: [], links: [], tool: 'mulas-1'};
			
			var element = null;
			Joint.dia.each(function (){
				element = {
					id: this.properties.name,
					text: this.properties.content,
					type: this.properties.object,
					x: this.properties.rect.x + this.properties.dx,
					y: this.properties.rect.y + this.properties.dy
				};
				if (this.properties.annotation) {
					element.flow = this.properties.annotation;
				}
				if (this.properties.delegation) {
					element.assignment = this.properties.delegation;
				}
				if (this.properties.range) {
					element.range = this.properties.range;
				}
				if (this.properties.adaptationStrategy) {
					element.adaptationStrategy = this.properties.adaptationStrategy;
				}
				modelJson.elements.push(element);
			});
			
			var joint = null;
			Joint.dia.eachJoint(function (){
				joint = {
					from: this._end.shape.wholeShape.properties.name,
					to: this._start.shape.wholeShape.properties.name,
					type: (this._opt.attrs.object ? this._opt.attrs.object : 'andArrow'),
				};
				if (this._opt.label) {
					joint.label = this._opt.label[0];
				}
				modelJson.links.push(joint);
			});
			
			
			
			var stringifiedModel = JSON.stringify(modelJson, null, 2);
			console.log(stringifiedModel);;
			return stringifiedModel;
		},
		createZanshinMetamodel: function() {
			var tempContent = "";
			var tempType = "";
			var systemName = 'testSystem';
			var metamodel = '<?xml version="1.0" encoding="UTF-8"?>\n<ecore:EPackage xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" name="' + systemName + '" nsURI="http://disi.unitn.it/zanshin/1.0/' + systemName + '" nsPrefix="' + systemName + '">\n';
			metamodel += '<eClassifiers xsi:type="ecore:EClass" name="' + systemName + 'GoalModel" eSuperTypes="http://disi.unitn.it/zanshin/1.0/gore#//GoalModel"/>';
			
			var element = null;
			Joint.dia.each(function (){
				element = {
					id: this.properties.name,
					text: this.properties.content,
					type: this.properties.object,
					x: this.properties.rect.x + this.properties.dx,
					y: this.properties.rect.y + this.properties.dy
				};
				
				tempContent = this.properties.content;
				tempContent = tempContent.replace(new RegExp( '\n', 'g' ), '');
				tempContent = tempContent.replace(new RegExp( '\ ', 'g' ), '');
				
				//<eClassifiers xsi:type="ecore:EClass" name="AR1" eSuperTypes="http://disi.unitn.it/zanshin/1.0/eca#//EcaAwReq"/>
				//<eClassifiers xsi:type="ecore:EClass" name="CaD" eSuperTypes="http://disi.unitn.it/zanshin/1.0/gore#//Parameter"/>
				
				if (this.properties.object == goalModel.TYPE_GOAL) {
					tempType = 'Goal';
					tempContent = 'G' + tempContent;
					metamodel += '<eClassifiers xsi:type="ecore:EClass" name="' + tempContent + '" eSuperTypes="http://disi.unitn.it/zanshin/1.0/gore#//' + tempType + '"/>\n';
				}
				else if (this.properties.object == goalModel.TYPE_TASK || this.properties.object == TYPE_DESIGN_TASK) {
					tempType = 'Task';
					tempContent = 'T' + tempContent;
					metamodel += '<eClassifiers xsi:type="ecore:EClass" name="' + tempContent + '" eSuperTypes="http://disi.unitn.it/zanshin/1.0/gore#//' + tempType + '"/>\n';
				}
				else if (this.properties.object == goalModel.TYPE_QUALITY || this.properties.object == TYPE_DESIGN_CONSTRAINT) {
					tempType = 'QualityConstraint';
					tempContent = 'Q' + tempContent;
					metamodel += '<eClassifiers xsi:type="ecore:EClass" name="' + tempContent + '" eSuperTypes="http://disi.unitn.it/zanshin/1.0/gore#//' + tempType + '"/>\n';
				}
				else if (this.properties.object == goalModel.TYPE_ASSUMPTION || this.properties.object == TYPE_DESIGN_ASSUMPTION) {
					tempType = 'DomainAssumption';
					tempContent = 'D' + tempContent;
					metamodel += '<eClassifiers xsi:type="ecore:EClass" name="' + tempContent + '" eSuperTypes="http://disi.unitn.it/zanshin/1.0/gore#//' + tempType + '"/>\n';
				}
				else if (this.properties.object == TYPE_INDICATOR) {
					tempType = 'EcaAwReq';
					tempContent = tempContent.split(':')[0];
					metamodel += '<eClassifiers xsi:type="ecore:EClass" name="' + tempContent + '" eSuperTypes="http://disi.unitn.it/zanshin/1.0/eca#//' + tempType + '"/>\n';
				}
				else if (this.properties.object == TYPE_PARAMETER) {
					tempType = 'Parameter';
					tempContent = tempContent;
					metamodel += '<eClassifiers xsi:type="ecore:EClass" name="' + tempContent + '" eSuperTypes="http://disi.unitn.it/zanshin/1.0/gore#//' + tempType + '"/>\n';
				}
				else {
					console.log("Faltou esse: " + this.properties.object);
				}
			});
			
			
			metamodel += '</ecore:EPackage>';
			console.log(metamodel);
			
			return "data:text/json;charset=utf-8," + escape(metamodel);
		},
		saveSvg: function() {
			//remove the buttons, we don't want them in the image
			for (i in hoverButtons) {
				//actually, we remove the buttons because currently they are based on image files
				//if, instead, they are regular svg elements, we don't need to remove them
				hoverButtons[i].remove();
			}
			
			$('svg').attr('width', $('#world').width());
            $('svg').attr('height', $('#world').height());
            
			//access the SVG element and serialize it
			var text = (new XMLSerializer()).serializeToString(document.getElementById("world").childNodes[0]);
			
			$('svg').attr('width', '100%');
            $('svg').attr('height', '100%');
			
			
			//put the buttons back
			createButtons();
			
			return "data:image/svg+xml," + encodeURIComponent(text);
		},
		savePng: function (callback, filename, resolutionFactor, transparent) {
            //create a canvas, which is used to convert the SVG to png
            var canvas = document.createElement('canvas');
            var canvasContext = canvas.getContext('2d');

            //create a img (DOM element) with the SVG content from our paper. This element will later be inserted in the canvas for converting to PNG
            var imageElement = new Image();
            $('svg').attr('width', $('#world').width());
            $('svg').attr('height', $('#world').height());
            var text = (new XMLSerializer()).serializeToString(document.getElementById("world").childNodes[0]);
            $('svg').attr('width', '100%');
            $('svg').attr('height', '100%');
            imageElement.src = "data:image/svg+xml," + encodeURIComponent(text);

            imageElement.onload = function () {
                canvas.width = imageElement.width * resolutionFactor; //multiply the width for better resolution
                canvas.height = imageElement.height * resolutionFactor; //multiply the height for better resolution
                if ( !transparent ) {
                    //fill the canvas with a color
                    canvasContext.fillStyle = 'white';
                    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
                }
                canvasContext.drawImage(imageElement, 0, 0, canvas.width, canvas.height);//insert the SVG image into the canvas. This does the actual rasterization of the image

                canvas.toBlob(function (blob) {
                    callback(blob, filename + '.png');
                });

            };
        },
		load: function(input) {
			if (input) {
				this.changedModel = true;

				Joint.dia.hardReset();
				createButtons();
				elementCounter = 1;
				var loadedObjects = Joint.dia.parse(input);

				for(i=0; i<loadedObjects.length; i++) {
					if (loadedObjects[i].properties && loadedObjects[i].properties.object) {
						if (loadedObjects[i].properties.object == goalModel.TYPE_GOAL) {
							goalModel.setupUiForNode.call(loadedObjects[i], goalModel.nodeCreators.goal);
							createAnnotation(loadedObjects[i]);
							createDelegation(loadedObjects[i]);
						}
						else if (loadedObjects[i].properties.object == goalModel.TYPE_TASK) {
							goalModel.setupUiForNode.call(loadedObjects[i], goalModel.nodeCreators.task);
							createAnnotation(loadedObjects[i]);
							createDelegation(loadedObjects[i]);
						}
						else if (loadedObjects[i].properties.object == goalModel.TYPE_QUALITY) {
							goalModel.setupUiForNode.call(loadedObjects[i], goalModel.nodeCreators.quality);
							createAnnotation(loadedObjects[i]);
							createDelegation(loadedObjects[i]);
						}
						
						else if (loadedObjects[i].properties.object == TYPE_DESIGN_TASK) {
							goalModel.setupUiForNode.call(loadedObjects[i], goalModel.nodeCreators.designTask);
							createAnnotation(loadedObjects[i]);
							createDelegation(loadedObjects[i]);
						}
						else if (loadedObjects[i].properties.object == TYPE_DESIGN_CONSTRAINT) {
							goalModel.setupUiForNode.call(loadedObjects[i], goalModel.nodeCreators.designConstraint);
							createAnnotation(loadedObjects[i]);
							createDelegation(loadedObjects[i]);
						}
						else if (loadedObjects[i].properties.object == TYPE_INDICATOR) {
							goalModel.setupUiForNode.call(loadedObjects[i], goalModel.nodeCreators.indicator);
						}
						else if (loadedObjects[i].properties.object == TYPE_PARAMETER) {
							goalModel.setupUiForNode.call(loadedObjects[i], goalModel.nodeCreators.parameter);
						}
						
						elementCounter++;
						
					 }
				}
				
				this.changeToRequirements();

			}
		},
		load2: function(inputText) {
			if (inputText) {
				this.changedModel = true;

				Joint.dia.hardReset();
				createButtons();
				
				goalModel.elementCounter = 0;
				var elements = [];
				
				var inputModel = $.parseJSON(inputText);
				
				//setup model dimensions
				if (inputModel.width && inputModel.height ) {
					goalModel.resizePaper(inputModel.width, inputModel.height);
				}
				
				//create elements
				if (inputModel.elements ) {
					var newElement = null;
					var nodeCreator = null;
					for (var i = 0; i < inputModel.elements.length; i++) {
						if (inputModel.elements[i].id && inputModel.elements[i].text && inputModel.elements[i].type && inputModel.elements[i].x && inputModel.elements[i].y) {

							nodeCreator = goalModel.nodeCreators[inputModel.elements[i].type];
							if (!nodeCreator) {
								var errorMessage = 'Unknown element type: ' + inputModel.elements[i].type + '. Element created as a goal by default: ' + inputModel.elements[i].id + ' - ' + inputModel.elements[i].text;
								console.log(errorMessage);
								displaySimpleWarning(errorMessage);
								nodeCreator = goalModel.nodeCreators[goalModel.TYPE_GOAL];
							}
							newElement = goalModel.createStandaloneNode({
								x:inputModel.elements[i].x,
								y:inputModel.elements[i].y,
								annotation:(inputModel.elements[i].flow ? inputModel.elements[i].flow : ''),
								delegation:(inputModel.elements[i].assignment ? inputModel.elements[i].assignment : '')
								}, nodeCreator, inputModel.elements[i].id);
							newElement.changeLabel(inputModel.elements[i].text);
							
							//special case: parameter (range)
							if (inputModel.elements[i].type == TYPE_PARAMETER && inputModel.elements[i].range) {
								newElement.properties.range = inputModel.elements[i].range;
							}
							//special case: indicator (adaptationStrategy)
							if (inputModel.elements[i].type == TYPE_INDICATOR && inputModel.elements[i].adaptationStrategy) {
								newElement.properties.adaptationStrategy = inputModel.elements[i].adaptationStrategy;
							}
							elements.push(inputModel.elements[i].id);
						}
					}
				}
				
				//create links
				if (inputModel.links) {
					var from = -1;
					var to = -1;
					var linkType = null;
					for (var i = 0; i < inputModel.links.length; i++) {
						if (inputModel.links[i].from && inputModel.links[i].from && inputModel.links[i].type) {
							var from = elements.indexOf(inputModel.links[i].from);
							var to = elements.indexOf(inputModel.links[i].to);
							switch (inputModel.links[i].type) {
								case 'andArrow':
									linkType = Joint.dia.goal.andArrow;
									break;
								case 'orArrow':
									linkType = Joint.dia.goal.orArrow;
									break;
								case 'line':
									linkType = Joint.dia.goal.line;
									break;
								default:
									console.log('Unknown link type: ' + inputModel.links[i].type + '. Link created as an andArrow by default');
									linkType = Joint.dia.goal.andArrow;
									break;
							}
							var object = Joint.dia._registeredObjects[1][to].joint(Joint.dia._registeredObjects[1][from], linkType);
							if (inputModel.links[i].label) {
								object.label(inputModel.links[i].label);
							}
							
						}
					}
				}
				
			}
		}
	};
	
	global.diagramManager = diagramManager;
})(this);

function sortObjectsByName(a, b){
	if (a.name > b.name) {
		return 1;
	}
	if (a.name < b.name) {
		return -1;
	}
	return 0;
}