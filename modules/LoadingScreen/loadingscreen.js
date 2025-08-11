// window.onload = function() {
//   const loadingScreen = document.getElementById('loading-screen');
//   loadingScreen.style.display = 'none';
// };

// setTimeout(function() {
//     const loadingScreen = document.getElementById('loading-screen');
//     loadingScreen.classList.add('fade-out');

//     // fading 1 second
//     setTimeout(() => {
//       loadingScreen.style.display = 'none';
//     }, 1000);
//   }, 3000); // 3 seconds

window.addEventListener("load", function() {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 1000);
  }, 2000); // 0.5s after load
});