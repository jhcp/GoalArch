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
	
	Joint.dia.downloadDataUri = function(dataUri, fileName) {
		//Copied from a more recent version of JointJS
		
        var blob = dataUriToBlob(dataUri);
        Joint.dia.downloadBlob(blob, fileName);
        
        // Convert an uri-encoded data component (possibly also base64-encoded) to a blob.
        function dataUriToBlob(dataUri) {

            // first, make sure there are no newlines in the data uri
            dataUri = dataUri.replace(/\s/g, '');
            dataUri = decodeURIComponent(dataUri);

            var firstCommaIndex = dataUri.indexOf(','); // split dataUri as `dataTypeString`,`data`

            var dataTypeString = dataUri.slice(0, firstCommaIndex); // e.g. 'data:image/jpeg;base64'
            var mimeString = dataTypeString.split(':')[1].split(';')[0]; // e.g. 'image/jpeg'

            var data = dataUri.slice(firstCommaIndex + 1);
            var decodedString;
            if (dataTypeString.indexOf('base64') >= 0) { // data may be encoded in base64
                decodedString = atob(data); // decode data
            } else {
                // convert the decoded string to UTF-8
                decodedString = unescape(encodeURIComponent(data));
            }
            // write the bytes of the string to a typed array
            var ia = new Uint8Array(decodedString.length);
            for (var i = 0; i < decodedString.length; i++) {
                ia[i] = decodedString.charCodeAt(i);
            }

            return new Blob([ia], { type: mimeString }); // return the typed array as Blob
        }
        
        
    }
    
    Joint.dia.downloadBlob = function(blob, fileName) {
        // Download `blob` as file with `fileName`.
        // Does not work in IE9.
        
        //Copied from a more recent version of JointJS

        if (window.navigator.msSaveBlob) { // requires IE 10+
            // pulls up a save dialog
            window.navigator.msSaveBlob(blob, fileName);

        } else { // other browsers
            // downloads directly in Chrome and Safari

            // presents a save/open dialog in Firefox
            // Firefox bug: `from` field in save dialog always shows `from:blob:`
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1053327

            var url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');

            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // mark the url for garbage collection
        }
    }
