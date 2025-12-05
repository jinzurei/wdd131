// Set copyright year and last modified date in the footer
document.addEventListener('DOMContentLoaded', function () {
  var yearSpan = document.getElementById('currentyear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  var modSpan = document.getElementById('lastModified');
  if (modSpan) {
    modSpan.textContent = document.lastModified;
  }
});