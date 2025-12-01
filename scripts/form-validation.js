// form-validation.js: Basic client-side validation for required fields

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    let valid = true;
    // Check all required fields
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.classList.add('input-error');
      } else {
        input.classList.remove('input-error');
      }
    });
    if (!valid) {
      e.preventDefault();
      alert('Please fill out all required fields.');
    }
  });
});
