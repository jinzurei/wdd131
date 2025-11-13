// Declare three variables that hold references to the input, button, and list elements
const input = document.querySelector('#favchap'); // favorite chapter input field
const button = document.querySelector('button');
const list = document.querySelector('#list');

// Create a click event listener for the Add Chapter button
button.addEventListener('click', function() {
    // Check to make sure the input is not blank
    if (input.value.trim() !== '') {
        // Create a li element that will hold each entry's chapter title and an associated delete button
        const li = document.createElement('li');
        
        // Create a delete button
        const deleteButton = document.createElement('button');
        
        // Populate the li element variable's textContent with the input value
        li.textContent = input.value;
        
        // Populate the button textContent with a ❌
        deleteButton.textContent = '❌';
        
        // Add aria-label for accessibility
        deleteButton.setAttribute('aria-label', `Remove ${input.value}`);
        
        // Add class to delete button for styling
        deleteButton.classList.add('delete');
        
        // Append the li element variable with the delete button
        li.append(deleteButton);
        
        // Append the li element variable to the unordered list in your HTML
        list.append(li);
        
        // Change the input value to nothing to clean up the interface
        input.value = '';
    }
    
    // Whether or not a list item was created, send focus to the input element
    input.focus();
});

// Add event listener to the list using event delegation for delete buttons
list.addEventListener('click', function(e) {
    // Check if the clicked element is a delete button
    if (e.target.classList.contains('delete')) {
        // Remove the parent li element
        e.target.parentElement.remove();
        input.focus();
    }
});
