// Extension of Joint.dia developed by João Pimentel
	
	//Features for the diagram as a whole
	
	Joint.dia.each = function (callback, args) {
		var i = 0;
		for (element in this._registeredObjects[1]) {
			callback.call(this._registeredObjects[1][element], this._registeredObjects[1][element], i);
			i++;
		}
	};
	Joint.dia.getElementByIndex = function (index) {
		return this._registeredObjects[1][index];
	};
	Joint.dia.eachJoint = function (callback, args) {
		for (joint in this._registeredJoints[1]) {
			callback.call(this._registeredJoints[1][joint], this._registeredJoints[1][joint]);
		}
	};
	Joint.dia.hardReset = function (callback, args) {
		while (this._registeredObjects[1][0]) this._registeredObjects[1][0].liquidate();
		Joint.paper().clear();
	};
	
	
	
	//Features for the elements of the diagram
	Joint.dia.highlightedNodes = [];
	Joint.dia.highlightTimeInterval = 3000;
	Joint.dia.Element.prototype.highlightTimed = function() {
		this.highlight();
		Joint.dia.highlightedNodes.push(this);
		
		if (Joint.dia.highlightedNodes.length < 2) {
			setTimeout(function (){
				for (i in Joint.dia.highlightedNodes) {
					Joint.dia.highlightedNodes[i].unhighlight();
				}
				Joint.dia.highlightedNodes = [];
			}, Joint.dia.highlightTimeInterval);
		}
	}
	
	Joint.dia.Element.prototype.hide = function(hideConnections) {
		//hide the element (wrapper + shadow + inner elements)
		this.wrapper.hide();
		if (this.shadow) {
			this.shadow.hide();
		}
		for (var i = 0; i < this.inner.length; i++) {
			this.inner[i].hide();
		}
		
		if (hideConnections) {
			//hide its connections
			var j = null;
			for (i in this.joints()) {
			    j = this.joints()[i];
			    j._opt.attrs['opacity'] = 0; 
			    j._opt.arrow.start.attrs.opacity = 0; 
			    j._opt.arrow.end.attrs.opacity = 0; 
			    j.redraw(); 
			}
		}
	}
	
	
	
	Joint.dia.Element.prototype.show = function(showConnections) {
		//show the element (wrapper + shadow + inner elements)
		this.wrapper.show();
		if (this.shadow) {
			this.shadow.show();
		}
		for (var i = 0; i < this.inner.length; i++) {
			this.inner[i].show();
		}
		
		if (showConnections) {
			//show its connections
			var j = null;
			for (i in this.joints()) {
			    j = this.joints()[i];
			    j._opt.attrs['opacity'] = 1; 
			    j._opt.arrow.start.attrs.opacity = 1; 
			    j._opt.arrow.end.attrs.opacity = 1; 
			    j.redraw(); 
			}
		}
	}
