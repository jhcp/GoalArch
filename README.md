GoalArch TOol (GATO)
========

This is a web-based tool for supporting the derivation of architectural models (namely, statecharts) from goal models.
A video demonstration is available at https://www.youtube.com/watch?v=vl4MdkGkzdQ (additional features were released
 after the recording of this video).

A live version of the tool is available here: https://gatoalpha-1049.appspot.com/

For further information, please contact jhcp at cin ufpe br

## Features
- Creation of Design Goal Models (DGM) with Awareness Requirements (indicators) and parameters
- Export a metamodel to be used with [Zanshin](https://github.com/sefms-disi-unitn/Zanshin/wiki/Creating-a-simulation,-part-1.-the-meta-model)
- Annotation of DGMs with delegation and flow expressions
- Save goal model as a JSON, SVG or PNG file
- Derive statechart from DGMs, based on the flow expressions
- Save the derived statechart as SVG or PNG


## Status
This tool is discontinued. No new functionalities will be added, but bugs reported on this repository may be fixed.
Pull requests are welcome.

## Development

Further info on the tool's requirements and architecture are provided in Chapter 5 of
[the thesis](papers/thesis-jhcp.pdf) and in [related papers](papers/readme.md).

### Client
The client is developed with plain HTML5, CSS and JavaScript. No building process is required. The only
feature that requires the backend is the statechart derivation, thus the goal modelling features can be used
offline. 

#### Dependencies
- JointJS and Raphael - provides the core modeling functionalities
- Bootstrap 2.3.2 - professional-looking style and components
- jQuery - facilitates DOM manipulation and cross-browser support
- X-editable - enables inline editing of DOM elements
- Mermaid - draws the statechart diagram
  
These libraries can be found in the [src/main/webapp/lib](src/main/webapp/lib) folder.

### Server
The generation of the transitions and super-states (composite states) of the statechart is handled
 by a Java web service. The input flow expression is tokenized and parsed by code generated through 
 [SableCC](https://sablecc.org/documentation) with the grammar defined in [exp.grammar](exp.grammar). The resulting
tree is evaluated and returned as a JSON object.

#### Dependencies
- GSON - to convert the resulting objecto to JSON
- JSTL - JavaServer Pages Standard Tag Library

These libraries can be found in the [src/main/webapp/WEB-INF/lib](src/main/webapp/WEB-INF/lib) folder.

### Deployment
Any Java EE server should be able to host this tool. It is currently deployed at Google App Engine, 
instructions for which can be found
[here](https://cloud.google.com/appengine/docs/standard/java/building-app/environment-setup).
See also [instructions for their Eclipse plugin](https://cloud.google.com/eclipse/docs/running-and-debugging).

When hosting this tool you'll need to change the endpoint URL in the getStatechart function within derivation.js.

## Credits
The tool was developed by João Pimentel.

GATO is the Portuguese word for cat, hence the cat favicon, which was generated using the following graphics 
from Twitter Twemoji:
- Graphics Title: 1f408-200d-2b1b.svg
- Graphics Author: Copyright 2020 Twitter, Inc and other contributors (https://github.com/twitter/twemoji)
- Graphics Source: https://github.com/twitter/twemoji/blob/master/assets/svg/1f408-200d-2b1b.svg
- Graphics License: CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
