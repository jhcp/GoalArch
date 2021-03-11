$(document).ready(function () {
	//startup
	$('#derivationDiv').hide();
	$('#adaptationDiv').hide();
	$('#transitionsDiv').hide();
	$('#newAreaWidth').val(Joint.paper().width);
	$('#newAreaHeight').val(Joint.paper().height);
	$.fn.editable.defaults.mode = 'inline';//x-editable setting
	
	changeListSelection('#modelingModeList', $('#buttonRequirementsMode'));
	
	//setup views buttons - buttons for selecting a step of the process
	$('#buttonRequirementsMode').click(function() {
		diagramManager.changeToRequirements();
		$('#world').show();
		$('#derivationDiv').hide();
		$('#adaptationDiv').hide();
		$('#transitionsDiv').hide();
		changeListSelection('#modelingModeList', $('#buttonRequirementsMode'));
	});
	$('#buttonDesignMode').click(function() {
		diagramManager.changeToDesign();
		$('#world').show();
		$('#derivationDiv').hide();
		$('#adaptationDiv').hide();
		$('#transitionsDiv').hide();
		changeListSelection('#modelingModeList', $('#buttonDesignMode'));
	});
	$('#buttonDelegationMode').click(function() {
		diagramManager.changeToDelegation();
		$('#world').show();
		$('#derivationDiv').hide();
		$('#adaptationDiv').hide();
		$('#transitionsDiv').hide();
		changeListSelection('#modelingModeList', $('#buttonDelegationMode'));
	});
	$('#buttonAnnotationMode').click(function() {
		diagramManager.changeToAnnotation();
		$('#world').show();
		$('#derivationDiv').hide();
		$('#adaptationDiv').hide();
		$('#transitionsDiv').hide();
		changeListSelection('#modelingModeList', $('#buttonAnnotationMode'));
	});
	$('#buttonDerivationMode').click(function() {
		diagramManager.changeToDerivation();
		$('#world').hide();
		$('#derivationDiv').show();
		$('#adaptationDiv').hide();
		$('#transitionsDiv').hide();
		changeListSelection('#modelingModeList', $('#buttonDerivationMode'));
	});
	$('#buttonAdaptationMode').click(function() {
		$('#world').hide();
		$('#derivationDiv').hide();
		$('#adaptationDiv').show();
		$('#transitionsDiv').hide();
		changeListSelection('#modelingModeList', $('#buttonAdaptationMode'));
		goalModel.mode = goalModel.MODE_ADAPTATION;
		
		var indicatorsHtml = '<table class="table table-striped table-condensed"><thead><th>Awareness Requirement</th><th>Adaptation Strategy</th></thead>';
		var indicators = diagramManager.listIndicators();
		$(indicators).each(function(){
			indicatorsHtml += '<tr><td>' + this.name + '</td><td><a class="editable editable-indicator" data-pk="' + this.index + '" href="#" data-type="textarea">' + this.adaptationStrategy + '</a></td></tr>';
		});
		indicatorsHtml += '</table>';
		$('#indicators').html(indicatorsHtml);
		$('.editable-indicator').editable({
			success: function(response, newValue) {
				diagramManager.setIndicatorAdaptationStrategy($(this).data('pk'), newValue);
			}
		});
		
		var parametersHtml = '<table class="table table-striped table-condensed"><thead><th>Parameter</th><th>Range</th></thead>';
		var parameters = diagramManager.listParameters();
		$.each(parameters, function(index, value){
			parametersHtml += '<tr><td>' + value.name + '</td><td><a class="editable editable-parameter" data-pk="' + value.index + '" href="#" data-type="textarea">' + value.range + '</a></td></tr>';
		});
		parametersHtml += '</table>';
		$('#parameters').html(parametersHtml);
		$('.editable-parameter').editable({
			success: function(response, newValue) {
				diagramManager.setParameterRange($(this).data('pk'), newValue);
			}
		});
		
	});
	$('#buttonTransitionsMode').click(function() {
		$('#world').hide();
		$('#derivationDiv').hide();
		$('#adaptationDiv').hide();
		$('#transitionsDiv').show();
		changeListSelection('#modelingModeList', $('#buttonTransitionsMode'));
		goalModel.mode = goalModel.MODE_TRANSITIONS;
		
		var transitionsHtml = '<table class="table table-striped table-condensed"><thead><th>Transition</th><th>Triggers and Conditions</th></thead>';
		$(transitions).each(function(){
			transitionsHtml += '<tr><td>' + this + '</td><td><a class="editable editable-transition" data-pk="' + this + '" href="#" data-type="textarea">' + '</a></td></tr>';
		});
		transitionsHtml += '</table>';
		$('#transitions').html(transitionsHtml);
		$('.editable-transition').editable({
			success: function(response, newValue) {
				//diagramManager.setIndicatorAdaptationStrategy($(this).data('pk'), newValue);
			}
		});
		
		// for (i in transitions) {
			// text += transitions[i] + ', ';
		// }
	});
	
	//setup toolbar buttons
	$('#mainToolbarTitle').click(function() {
		$('#mainToolbarContent').toggle(300);
	});
	$('#toolbarToggleId').click(function() {
		diagramManager.toggleViewIds();
	});
	$('#toolbarToggleAdaptationElements').click(function() {
		diagramManager.toggleViewAdaptationElements();
	});
	$('#toolbarAnalyzeModel').click(function() {
		processAnnotations();
		diagramManager.changeToAnnotation();
		$('#world').show();
		$('#derivationDiv').hide();
		changeListSelection('#modelingModeList', $('#buttonAnnotationMode'));
		//window.scrollTo(0, document.body.scrollHeight);
	});
	$('#toolbarSaveModel').click(function() {
		model = diagramManager.saveModel();
		var csvData = 'data:text/json;charset=utf-8,' + (encodeURI(model));
    	Joint.dia.downloadDataUri(csvData, 'gato-GoalModel.txt');
	});
	$('#toolbarClearModel').click(function() {
		goalModel.clearPaper();
		diagramManager.changeToRequirements();
		$('#world').show();
		$('#derivationDiv').hide();
		changeListSelection('#modelingModeList', $('#buttonRequirementsMode'));
	});
	$('#toolbarSaveSVG').click(function() {
		 if (goalModel.mode == goalModel.MODE_DERIVATION) {
		 	var svgData = diagramManager.saveSvg('statechart');
		 	Joint.dia.downloadDataUri(svgData, 'gato-Statechart.svg');
		 }
		 else {
		 	var svgData = diagramManager.saveSvg('goalmodel');
		 	Joint.dia.downloadDataUri(svgData, 'gato-GoalModel.svg');
		 }
	});
	$('#toolbarSavePNG').click(function() {
		if (goalModel.mode == goalModel.MODE_DERIVATION) {
			diagramManager.savePng(Joint.dia.downloadBlob, 'gato-Statechart', 4, true, 'statechart');
		}
		else {
			diagramManager.savePng(Joint.dia.downloadBlob, 'gato-GoalModel', 1, true, 'goalmodel');
		}
	});
	$('#toolbarCreateMetamodel').click(function() {
		var metamodelData = diagramManager.createZanshinMetamodel();
		Joint.dia.downloadDataUri(metamodelData, 'gato-ZanshinMetamodel.ecore');
	});

	
	//setup modal buttons actions
	$('#loadButton').click(function () {
		$('#world').show();
		$('#derivationDiv').hide();
		$('#adaptationDiv').hide();
		$('#transitionsDiv').hide();
		goalModel.changedModel = true;
		$(this).button('loading');
		//load the model with a small delay, giving time to the browser to display the 'loading' message
		setTimeout(function (){
			//call the actual loading
			try {
				if ($('#actualFileInput')[0].files.length == 0) {
					//if there is no file selected, load the model from the textArea
					diagramManager.load2($('#loadModelContent').val());
					
					
					$('#loadModelModal').modal('hide');
					$('#loadButton').button('reset');
					diagramManager.changeToDesign();
					$('#world').show();
					$('#derivationDiv').hide();
					$('#adaptationDiv').hide();
					$('#transitionsDiv').hide();
					changeListSelection('#modelingModeList', $('#buttonDesignMode'));
				}
				else {
					//else, load model from file
					var file = $('#actualFileInput')[0].files[0];
					if (file.type == 'text/plain') {
						var fileReader = new FileReader();
						fileReader.onload = function(e) { 
							diagramManager.load2(e.target.result);
							
							$('#loadModelModal').modal('hide');
							$('#loadButton').button('reset');
							diagramManager.changeToDesign();
							$('#world').show();
							$('#derivationDiv').hide();
							$('#adaptationDiv').hide();
							$('#transitionsDiv').hide();
							changeListSelection('#modelingModeList', $('#buttonDesignMode'));
						};  
						fileReader.readAsText(file);
					}
					else {
						alert('Sorry, this kind of file is not valid');
						$('#loadButton').button('reset');
						$('#loadModelModal').modal('hide');
					}
				}
			} 
			catch(error) {
				$('#loadButton').button('reset');
				alert('Sorry, the input model is not valid.');
				console.log(error);
				console.log(error.stack);
			}
		},20);
	});
	$('#resizePaper').click(function () {
		goalModel.resizePaper($('#newAreaWidth').val(), $('#newAreaHeight').val());
	});
	
	
	//setup input focus on modals
	$(".modal").on('shown', function() {
		$(this).find("[autofocus]:first").focus().select();
	});
	
	//keyboard shortcuts
	$(document).keypress(function(e) {		
		if (goalModel.highlightedNode!=null) {
			if (goalModel.mode === goalModel.MODE_DESIGN) {
				if (e.which==69 || e.which==101) {  //E or e
					goalModel.editNode.call(goalModel.highlightedNode)
				}
				else if (e.which==84 || e.which==116) {  //T or t
					goalModel.createChildNode(null, goalModel.nodeCreators[TYPE_DESIGN_TASK], goalModel.highlightedNode);
				}
				else if (e.which==81 || e.which==113) {  //Q or q
					goalModel.createChildNode(null, goalModel.nodeCreators[TYPE_DESIGN_CONSTRAINT], goalModel.highlightedNode);
				}
				else if (e.which==65 || e.which==97) {  //A or a
					goalModel.createChildNode(null, goalModel.nodeCreators[TYPE_DESIGN_ASSUMPTION], goalModel.highlightedNode);
				}
				
				
				else if (e.which==80 || e.which==112) {  //P or p
					goalModel.createChildNode(null, goalModel.nodeCreators[TYPE_PARAMETER], goalModel.highlightedNode);
					if (!diagramManager.isShowAdaptationElements()) {
						$('#toolbarToggleAdaptationElements').button('toggle');
						diagramManager.toggleViewAdaptationElements();
					}
				}
				else if (e.which==73 || e.which==105) {  //I or i
					goalModel.createChildNode(null, goalModel.nodeCreators[TYPE_INDICATOR], goalModel.highlightedNode);
					if (!diagramManager.isShowAdaptationElements()) {
						$('#toolbarToggleAdaptationElements').button('toggle');
						diagramManager.toggleViewAdaptationElements();
					}
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
			
			else if (goalModel.mode === goalModel.MODE_DELEGATION) {
				if (e.which==69 || e.which==101) {  //E or e
					editDelegation.call(goalModel.highlightedNode)
				}
			}
			
			else if (goalModel.mode === goalModel.MODE_ANNOTATION) {
				if (e.which==69 || e.which==101) {  //E or e
					editAnnotation.call(goalModel.highlightedNode)
				}
				else if (e.which==65 || e.which==97) {  //A or a
					processAnnotations();
				}
			}
		}
		
		else if (goalModel.mode === goalModel.MODE_ANNOTATION) {
			if (e.which==65 || e.which==97) {  //A or a
				processAnnotations();
			}
		}
	});
	
	$('#loadingStatus').hide();
	
});

function changeListSelection(listId, selectionObject) {
	//update the actually selected element
	var listElements = $(listId + ' li');
	for(i=0; i<listElements.length; i++) {
		$(listElements[i]).removeClass('active');
	}
	$(selectionObject).toggleClass('active');

	//update the name of the view
	if ($(selectionObject).attr('data-content')) {
		$('#currentViewName').html('[' + $(selectionObject).attr('data-content') + ']');
		
		//if a view was selected, also activate the views button
		$('#viewsButton').toggleClass('active');
	}
	else {
		$('#currentViewName').html('');
	}
}