
// form-enhancements.js: Handles extra UI features for form.html
document.addEventListener('DOMContentLoaded', function() {
  // Autofocus first input in the form
  const firstInput = document.querySelector('form input, form select, form textarea');
  if (firstInput) firstInput.focus();

  // Add a visual effect to focused fields
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('focus', function() {
      el.classList.add('input-focus');
    });
    el.addEventListener('blur', function() {
      el.classList.remove('input-focus');
    });
  });
});
