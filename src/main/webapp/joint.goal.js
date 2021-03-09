(function(global){	// BEGIN CLOSURE

	var Joint = global.Joint,
	     Element = Joint.dia.Element,
	     point = Joint.point;

	/**
	 * @name Joint.dia.goal
	 * @namespace Holds functionality related to Goal Models.
	 */
	var goal = Joint.dia.goal = {};


	//   In this section you can declare the shapes for links between elements. E.g.: and-refinement, contribution links, dependecies, etc.
	goal.line = {
	    object: 'line',
	    startArrow: {type: 'none'},
	    endArrow: {type: 'none'},
	    attrs: {'stroke-dasharray': 'none', 'stroke-width': 2, stroke: 'gray' , "object": 'line'},
	    interactive: false,
	    cursor:'default',
	    labelBoxAttrs: {'fill':'yellow', 'stroke':'black'},
	    
	};

	goal.andArrow = {
	    object: 'andArrow',
	    startArrow: {type: 'basic', size: 5, 'fill':'white' },
	    endArrow: {type: 'none'},
	    attrs: {'stroke-dasharray': 'none', 'stroke-width': 2, stroke: 'gray', "object": 'andArrow'},
	    interactive: false,
	    cursor:'default',
	    /*label: 'AND',
	    labelAttrs: {
		  'font-size': 10
	    }*/
	    //label: 'a',
	    labelBoxAttrs: {'fill':'yellow', 'stroke':'black'},
	    labelBoxAttrsDefault: {'fill':'yellow', 'stroke':'black'},
	};
	
	goal.orArrow = {
	  object: 'orArrow',
	  startArrow: { type: "basic", size: 5, attrs: {fill: "white"} },
	  endArrow: {type: "none"},
	  attrs: { "stroke-dasharray": "none", "object": 'orArrow' },
	  interactive: false,
	  cursor:'default'
	};
	
	goal.hurt = {
		object: 'hurtArrow',
	    startArrow: {type: "basic", size: 5},
	    endArrow: {type: 'none'},
	    attrs: {"stroke-dasharray": "none"},
	    label: 'hurt',
	    labelAttrs: { position: 0.2, offset: -8},
	    labelBoxAttrs: {'fill-opacity':'0', 'stroke-opacity':'0'},
	    interactive: false,
	    cursor:'default'
	};
	
	goal.help = {
		object: 'helpArrow',
	    startArrow: {type: "basic", size: 5},
	    endArrow: {type: 'none'},
	    attrs: {"stroke-dasharray": "none"},
	    label: 'help',
	    labelAttrs: { position: 0.2, offset: -8},
	    labelBoxAttrs: {'fill-opacity':'0', 'stroke-opacity':'0'},
	    interactive: false,
	    cursor:'default'
	};

	
	
	//   In this section you can declare the shapes for elements of the goal model. E.g.: goals, tasks, resources, actor, etc..
	/**
	 * Goal model (actual) goal.
	 * @methodOf Joint.dia.goal
	 */
	goal.Goal = Element.extend({
	    object: 'goal',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'lightgreen', stroke: 'black', 'stroke-width': 2 },
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold' },
			labelOffsetY: 0,
			radius: 20,
			shadow: true,
			padding: 1
		  });
		  this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, p.radius).attr(p.attrs));
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});


	/**
	 * Goal model task.
	 * @methodOf Joint.dia.goal
	 */
	goal.Task = Element.extend({
	    object: 'task',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'rgb(140,204,241)', stroke: 'black', 'stroke-width': 2 },
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold' },
			labelOffsetY: -10,
			radius: 15,
			shadow: true,
			padding: 5
		  });
		  
		  var path=this.paper.path(
			'M '+p.rect.x+' ' + (p.rect.y+p.rect.height/2) +
			' l '+ p.radius +' '+ p.rect.height/(-2) +
			' l '+ (p.rect.width-(p.radius*2)) +' 0' +
			' l '+ p.radius +' '+p.rect.height/2 +
			' l '+ (p.radius*-1) +' '+p.rect.height/2 +
			' l '+ (p.rect.width-(p.radius*2))*(-1) +' 0' +
			' z');
		  
		  path.attr(p.attrs);
		
		  this.setWrapper(path);
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});
	
	/**
	 * Goal model task.
	 * @methodOf Joint.dia.goal
	 */
	goal.Softgoal = Element.extend({
	    object: 'softgoal',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'rgb(220,220,220)', stroke: 'black', 'stroke-width': 2 },
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold' },
			labelOffsetY: -10,
			radius: 15,
			shadow: true,
			padding: 5
		  });
		  
		  var path=this.paper.path('<path stroke="black" style="fill: none; stroke-width: 1px; vector-effect: non-scaling-stroke;" transform="matrix(0.779219 0 0 0.779219 149.4 86.9831)" id="e16_path" d="M ' + p.rect.x + ' ' + (p.rect.y) + ' a 26.1831 26.1831 0 0 1 25 -3 a 18.8816 18.8816 0 0 1 27 -5 a 15.2684 15.2684 0 0 1 17.4999 3.25 a 19.182 19.182 0 0 1 24 -5 a 11.2361 11.2361 0 0 1 14.5 6.5 a 7.5085 7.5085 0 0 1 7 9 a 6.51159 6.51159 0 0 1 2.5 9.99998 a 7.67717 7.67717 0 0 1 -9 9.5 a 18.0487 18.0487 0 0 1 -17.25 3.625 a 41.1115 41.1115 0 0 1 -50.25 4.25 a 20.8059 20.8059 0 0 1 -22.25 0.25 a 28.5345 28.5345 0 0 1 -19.75 -6 a 12.0307 12.0307 0 0 1 -2.75 -21.75 a 6.06009 6.06009 0 0 1 3.74945 -5.62563 Z"/>');
		  //M25.372,6.912c-0.093-3.925-3.302-7.078-7.248-7.08c-2.638,0.002-4.942,1.412-6.208,3.518c-0.595-0.327-1.28-0.518-2.01-0.518C7.627,2.834,5.773,4.639,5.69,6.898c-2.393,0.786-4.125,3.025-4.127,5.686c0,3.312,2.687,6,6,6v-0.002h15.875c3.312,0,6-2.688,6-6C29.434,9.944,27.732,7.715,25.372,6.912zM23.436,16.584H7.562c-2.209-0.006-3.997-1.793-4.001-4c-0.002-1.983,1.45-3.619,3.35-3.933c0.265-0.043,0.502-0.19,0.657-0.414C7.723,8.015,7.78,7.74,7.731,7.475C7.703,7.326,7.686,7.187,7.686,7.051c0.004-1.225,0.995-2.217,2.22-2.219c0.647,0,1.217,0.278,1.633,0.731c0.233,0.257,0.587,0.375,0.927,0.31c0.342-0.066,0.626-0.308,0.748-0.631c0.749-1.992,2.662-3.412,4.911-3.41c2.898,0.004,5.244,2.351,5.251,5.25c0,0.16-0.009,0.325-0.026,0.496c-0.05,0.518,0.305,0.984,0.814,1.079c1.859,0.345,3.273,1.966,3.271,3.923C27.43,14.791,25.645,16.578,23.436,16.584z');
		  path.attr(p.attrs);
		
		  this.setWrapper(path);
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});


	/**
	 * Goal model quality constraint (QC).
	 * @methodOf Joint.dia.goal
	 */
	goal.Quality = Element.extend({
	    object: 'quality',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'rgb(254,191,1)', stroke: 'black', 'stroke-width': 2 },
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold' },
			labelOffsetY: -10,
			radius: 5,
			shadow: true,
			padding: 5
		  });
		  this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, p.radius).attr(p.attrs));
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});

	/**
	 * Goal model design task.
	 * @methodOf Joint.dia.goal
	 */
	goal.DesignTask = Element.extend({
	    object: 'designTask',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: '#61b2e3', stroke: 'black', 'stroke-width': 2, 'stroke-dasharray': '-' },
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold' },
			labelOffsetY: -10,
			radius: 15,
			shadow: true,
			padding: 5
		  });
		  
		  var path=this.paper.path(
			'M '+p.rect.x+' ' + (p.rect.y+p.rect.height/2) +
			' l '+ p.radius +' '+ p.rect.height/(-2) +
			' l '+ (p.rect.width-(p.radius*2)) +' 0' +
			' l '+ p.radius +' '+p.rect.height/2 +
			' l '+ (p.radius*-1) +' '+p.rect.height/2 +
			' l '+ (p.rect.width-(p.radius*2))*(-1) +' 0' +
			' z');
		  path.attr(p.attrs);
		
		  this.setWrapper(path);
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});

	/**
	 * Goal model design constraint.
	 * @methodOf Joint.dia.goal
	 */
	goal.DesignConstraint = Element.extend({
	    object: 'designConstraint',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'rgb(255,140,1)', stroke: 'black', 'stroke-width': 2, 'stroke-dasharray': '-' },
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold' },
			labelOffsetY: -10,
			radius: 5,
			shadow: true,
			padding: 5
		  });
		  this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, p.radius).attr(p.attrs));
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});

	/**
	 * Goal model domain assumption.
	 * @methodOf Joint.dia.goal
	 */
	goal.DomainAssumption = Element.extend({
	    object: 'domainAssumption',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'rgb(255,255,255)', stroke: 'black', 'stroke-width': 2},
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold' },
			labelOffsetY: -10,
			radius: 5,
			shadow: true,
			padding: 5
		  });
		  this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, 0).attr(p.attrs));
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});


	/**
	 * Goal model design assumption.
	 * @methodOf Joint.dia.goal
	 */
	goal.DesignAssumption = Element.extend({
	    object: 'designAssumption',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'rgb(255,255,255)', stroke: 'black', 'stroke-width': 2, 'stroke-dasharray': '-'} ,
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold' },
			labelOffsetY: -10,
			radius: 5,
			shadow: true,
			padding: 5
		  });
		  this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, 0).attr(p.attrs));
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});


	/**
	 * Goal model parameter (control variable)
	 * @methodOf Joint.dia.goal
	 */
	goal.Parameter = Element.extend({
	    object: 'parameter',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'black', stroke: 'black', 'stroke-width': 1},
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold', 'text-anchor':'start'  },
			labelOffsetY: 0,
			radius: 5,
			shadow: false,
			padding: 0,
		  });
		  var path=this.paper.path(
			'M '+p.rect.x+' ' + (p.rect.y+p.rect.height/2) +
			' l '+ p.radius +' '+ p.radius/(-1) +
			' l '+ p.radius +' '+ p.radius +
			' l '+ p.radius*(-1) +' '+ p.radius +
			' l '+ p.radius*(-1) +' '+ p.radius*(-1) +

			' z');
		  path.attr(p.attrs);
		
		  this.setWrapper(path);
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width + 5, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});


	/**
	 * Goal model indicator (Awareness Requirement)
	 * @methodOf Joint.dia.goal
	 */
	goal.Indicator = Element.extend({
	    object: 'indicator',
	    module: 'goal',
	    init: function(properties) {
		  var p = Joint.DeepSupplement(this.properties, properties, {
			attrs: { fill: 'white', stroke: 'black', 'stroke-width': 2},
			name: '',
			content: '',
			labelAttrs: { 'font-size': '12px', 'font-weight': 'bold', 'text-anchor':'start'  },
			labelOffsetY: 0,
			radius: 4,
			shadow: false,
			padding: 0,
		  });
		  this.setWrapper(this.paper.circle(p.rect.x, p.rect.y, p.radius).attr(p.attrs));
		  
		  this.addInner(this.getContentElement());
	    },
	    getContentElement: function() {
		var p = this.properties,
		    bb = this.wrapper.getBBox(),
		    t = this.paper.text(bb.x + bb.width + 5, bb.y + bb.height/2, p.content).attr(p.labelAttrs || {}),
		    tbb = t.getBBox();
		//t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
		return t;
	    },
	    changeLabel: function(text){
		 this.properties.content = text;
		 this.inner[0].attr('text', this.properties.content);
	    }
	});


})(this);	// END CLOSURE