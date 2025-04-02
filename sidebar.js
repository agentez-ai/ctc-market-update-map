document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion').forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.nextElementSibling;
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    });
  });
});