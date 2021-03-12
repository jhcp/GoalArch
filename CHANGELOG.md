2.4:
 - NEW FEATURE: download the goal model as a PNG image
 - NEW FEATURE: download the statechart diagram as a SVG or PNG image
 - NEW FEATURE: display super-states in the statechart diagram 
 - NEW FEATURE: now it is also possible to add indicators and parameters when in the requirements view. Previously they could only be added when in the design view
 - UI tweak: use buttons to add indicators and parameters. Previously, these elements could only be added through keyboard shortcuts
 - UI tweak: add cat favicon
 - UI tweak: fix font and background options of the goal model annotations, which were working in 2015 but stopped working afterwards
 - UI tweak: different error messages for when the server can't be reached and for when the server is not able to process the input
 - UI tweak: minor improvements to the UI
 - UI tweak: update of the about page 
 - CODE: update jQuery through its migrations
 - CODE: automated tests of the flow expressions processing moved to this repository
 - BUG: fix goal model saving (JSON), goal model image saving (SVG), and Zanshin metamodel saving (ecore), which were working in 2015 but stopped working afterwards. The old mechanism was replaced by a current mechanism that enables direct download without further user actions
 - BUG: fix statechart diagram display, which was working in 2015 but stopped working afterwards
 - BUG: fix error when trying to derive statechart with a flow expression containing alternative states
 - BUG: fix wrong size of the annotation background when the model was loaded from a file
 - BUG: the statechart is erased when the goal model is changed, in order to prevent inconsistencies. Previously the statechart wasn't being erased when a goal model file was loaded. This was fixed
 - BUG: fixed a error that when the user clicked on the Add Quality button a Task was added instead. This used to happen when the user cleared (erased) the goal model more than once.  
 
2.3:
 - NEW FEATURE: assign different positions when adding new elements in the model, in order to prevent the newest element from completely hiding the earlier ones
 - NEW FEATURE: correct functioning of the "add element" buttons in design mode
 - UI tweak: prevent accidental selection of elements (text highlighting). For this, I used the following CSS property: user-select: none
 - UI tweak: display the name of the current modelling view on the views button
 - UI tweak: activate the views button when any view is selected
 - UI tweak: after start up, indicates that it is in the requirements view
 - CODE: repositioning of script tags on index.html
 - CODE: display about info on console, for developers
 - BUG: all of a sudden, the dragging of elements stopped working in Chrome. Fixing it required changing a line in raphael.1.5.2.js, based on the discussion at https://github.com/DmitryBaranovskiy/raphael/issues/679
 
2.2:
 - NEW FEATURE: basic handling of softgoals
 - NEW FEATURE: generate a statechart diagram after derivation
 - NEW FEATURE: create Zanshin's metamodel
 - NEW FEATURE: changed the way of saving models: instead of showing a new modal, now it opens the model on a new tab, which can be saved directly from the browser
 - BUG: fixed bug that made elementCounter increase at each load. With successive loads, the id number of any new added element was increasingly higher.

2.1:
 - NEW FEATURE: Confirmation prompt before deleting a node
 - UI tweak: Rounded corners for the "add" buttons (which display when an element of the model is hovered). This was done by making the corners of the image transparent, using an image editor.
 - UI tweak: Different initial example (now it is just a single goal)
 - BUG: fixed a bug that displaced the wrong ID shapes when moving elements. Related to shapeless elements (indicators and parameters)
 - CODE: Refactoring and commenting to facilitate the creation of different goal modeling notations