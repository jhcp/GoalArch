2.3:
 - assign different positions when adding new elements in the model, in order to prevent the newest element from completely hiding the earlier ones
 - correct functioning of the "add element" buttons in design mode
 - UI tweak: prevent accidental selection of elements (text highlighting). For this, I used the following CSS property: user-select: none
 - UI tweak: display the name of the current modelling view on the views button
 - UI tweak: activate the views button when any view is selected
 - UI tweak: after start up, indicates that it is in the requirements view
 - CODE: repositioning of script tags on index.html
 - CODE: display about info on console, for developers
 - BUG: all of a sudden, the dragging of elements stopped working in Chrome. Fixing it required changing a line in raphael.1.5.2.js, based on the discussion at https://github.com/DmitryBaranovskiy/raphael/issues/679
 
2.2:
 - basic handling of softgoals
 - generate a statechart diagram after derivation
 - create Zanshin's metamodel
 - changed the way of saving models: instead of showing a new modal, now it opens the model on a new tab, which can be saved directly from the browser
 - BUG: fixed bug that made elementCounter increase at each load. With successive loads, the id number of any new added element was increasingly higher.

2.1:
 - Confirmation prompt before deleting a node
 - UI tweak: Rounded corners for the "add" buttons (which display when an element of the model is hovered). This was done by making the corners of the image transparent, using an image editor.
 - UI tweak: Different initial example (now it is just a single goal)
 - BUG: fixed a bug that displaced the wrong ID shapes when moving elements. Related to shapeless elements (indicators and parameters)
 - CODE: Refactoring and commenting to facilitate the creation of different goal modeling notations