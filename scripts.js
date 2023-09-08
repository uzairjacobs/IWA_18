import { createOrderData, updateDragging } from "./data.js";
import { createOrderHtml, html, updateDraggingHtml } from "./view.js";

const handleAddToggle = (e) => { //e stands for event object (click event)
  html.other.add.focus(); 
  const {overlay, cancel, form} = html.add; //extracts three variables from html.add.
  overlay.show(); //the method is called to display a hidden element.
  if (e.target === cancel) { 
    overlay.close();
    form.reset(); //reset() method is used to clear the form's input fields and reset them to their default values
  }
};

const handleHelpToggle = (e) => { 
    const { overlay, cancel } = html.help; //destructuring to extract overlay and cancel
    overlay.show(); 
    if (e.target === cancel) overlay.close(); //if the event target clicked is the same as "cancel" element, it will close the overlay
  };

const handleAddSubmit = (e) => {
  e.preventDefault(); //method prevents the default behavior of form submission, which would typically cause the page to refresh
  const overlay = html.add.overlay;
  const formData = new FormData(e.target); // allows us to access forms input field
  const data = Object.fromEntries(formData); //Object.fromEntries() method - transforms data into usable format
  const newData = createOrderData(data); // used function to process and organize data defined in our data.js
  const htmlData = createOrderHtml(newData); // used function to generate HTML markup with current data, defined in view.js
  const appendData = document.querySelector('[data-area="ordered"]'); // where we append the generated HTML
  e.target.reset(); //clears form input after processing the form data
  overlay.close(); //closes overlay
  appendData.appendChild(htmlData); //inserts generated content in the HTML
};

const handleEditToggle = (e) => {
  
  //buttons to manage editing
  const input = html.edit.title;
  const overlay = html.edit.overlay;
  const option = html.edit.column;
  const cancelButton = html.edit.cancel;
  const select = html.edit.table;

  e.target.dataset.id ? overlay.show() : undefined; //checks if the element that triggered event has a data-id attribute (unique id we created using the createUniqueId) then displays it, if it doesn't then nothing happens
  const id = e.target.dataset.id ? e.target.dataset.id : undefined; //sets the id to const id variable if it exists


  // sets value for input and select variables(table number and the title)
  input.value = e.target.dataset.id
    ? e.target.querySelector(".order__title").textContent
    : undefined;
  select.value = e.target.dataset.id
    ? e.target.querySelector(".order__value").textContent
    : undefined;

// finds an html element with a data-id matching the captured id
// sets value to the closest ancestor section element (ordered,prepared,served)
  let section = document.querySelector(`[data-id="${id}"]`); 
  option.value = section ? section.closest("section").dataset.area : "";

  if (e.target === cancelButton) {
    overlay.close();
  }
  html.edit.delete.id = id; //sets the id property of the delete object within the html.edit object.
};

const handleEditSubmit = (e) => {
  e.preventDefault();


  const removeId = html.edit.delete.id; //gets id value 
  const deleteOrder = document.querySelector(`[data-id="${removeId}"]`);// finds element with id element that matches the id
  deleteOrder.remove(); //.remove() method to remove element from DOM


  const overlay = html.edit.overlay;
  const formData = new FormData(e.target); //captures new data submitted
  const data = Object.fromEntries(formData);
  const newData = createOrderData(data);
  const htmlData = createOrderHtml(newData);
  const appendedData = document.querySelector(`[data-area="${newData.column}"]`); // column(ordered,prepped,served)
  appendedData.appendChild(htmlData);
  e.target.reset();
  overlay.close();
};

const handleDelete = (e) => {
  const idToDelete = html.edit.delete.id; //gets id to be deleted from object
  const orderToDelete = document.querySelector(`[data-id="${idToDelete}"]`); //finds a matching id in the HTML and stores the element that holds that id attribute

  const overlay = html.edit.overlay;
  orderToDelete.remove(); 
  overlay.close();
};


html.add.cancel.addEventListener("click", handleAddToggle); 
html.other.add.addEventListener("click", handleAddToggle); 
html.add.form.addEventListener("submit", handleAddSubmit); 
html.other.grid.addEventListener("click", handleEditToggle); 
html.edit.cancel.addEventListener("click", handleEditToggle); 
html.edit.form.addEventListener("submit", handleEditSubmit); 
html.edit.delete.addEventListener("click", handleDelete); 
html.help.cancel.addEventListener("click", handleHelpToggle); 
html.other.help.addEventListener("click", handleHelpToggle); 

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event
 */

const handleDragOver = (event) => {
  event.preventDefault();
  const path = event.path || event.composedPath();
  let column = null;
  for (const element of path) {
    const { area } = element.dataset;
    if (area) {
      column = area;
      break;
    }
  }
  if (!column) return;
  updateDragging({ over: column });
  updateDraggingHtml({ over: column });
};

let dragged; //used to store a reference to the element that is being dragged
const handleDragStart = (e) => { //function is triggered when an element is dragged
  dragged = e.target; //by assigning dragged to e.target it allows us to keep track of which element is being dragged
};

const handleDragDrop = (e) => {
  e.target.append(dragged); //appends the dragged element to the element that triggered the event (e.target)
};

const handleDragEnd = (e) => { //when mouse button is released
  const background = e.target.closest("section"); //e.target is where drag ended, background is assigned to the section where mouse button was released
  background.style.backgroundColor = ""; //sets the backgroundColor property of the background element to an empty string, used to reset background color
};


for (const htmlArea of Object.values(html.area)) {
  htmlArea.addEventListener("dragover", handleDragOver);
  htmlArea.addEventListener("dragstart", handleDragStart);
  htmlArea.addEventListener("drop", handleDragDrop);
  htmlArea.addEventListener("dragend", handleDragEnd);
}