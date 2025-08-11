function scaleChat() {
    const baseWidth = 1360;
    const scaleFactor = Math.min(window.innerWidth / baseWidth, 1);
    document.querySelector('.chat-content').style.transform = `scale(${scaleFactor})`;
}

window.addEventListener('resize', scaleChat);
window.addEventListener('load', scaleChat);

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

function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

setVH();
window.addEventListener('resize', setVH);