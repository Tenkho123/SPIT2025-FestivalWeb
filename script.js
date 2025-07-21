
// start: Scrollbar
const scrollableDiv = document.querySelector('.chat-container');
let hideScrollbarTimeout = null;

scrollableDiv.addEventListener('scroll', () => {
  // Show scrollbar
  scrollableDiv.classList.remove('hide-scrollbar');

  // Reset timer
  clearTimeout(hideScrollbarTimeout);

  // Hide after 2 seconds of inactivity
  hideScrollbarTimeout = setTimeout(() => {
    scrollableDiv.classList.add('hide-scrollbar');
  }, 2000);
});

// Optional: Start hidden
scrollableDiv.classList.add('hide-scrollbar');
// end: Scrollbar