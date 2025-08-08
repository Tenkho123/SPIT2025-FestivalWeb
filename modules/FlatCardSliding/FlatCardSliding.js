const carousel = document.getElementById('flat-card-carousel');
  const images = Array.from(carousel.querySelectorAll('img'));
  const title = document.getElementById('title');
  const desc = document.getElementById('desc');

  let currentIndex = 0;

  function updateCarousel() {
    const total = images.length;
    images.forEach((img, i) => {
      const offset = (i - currentIndex + total) % total;
      img.style.zIndex = (offset === 0) ? 3 : (offset === 1 || offset === total - 1) ? 2 : 1;
      if (offset === 0) { // ảnh ở giữa
        img.style.transform = "translate(-50%, -50%) scale(1)";
        img.style.opacity = 1;
      } else if (offset === 1) { // ảnh bên phải
        img.style.transform = "translate(calc(-50% + 140px), -50%) scale(0.8)";
        img.style.opacity = 0.7;
      } else if (offset === total - 1) { // ảnh bên trái
        img.style.transform = "translate(calc(-50% - 140px), -50%) scale(0.8)";
        img.style.opacity = 0.7;
      } else {
        img.style.transform = "translate(-50%, -50%) scale(0.6)";
        img.style.opacity = 0;
      }
    });

    // Cập nhật tiêu đề + mô tả
    const activeImg = images[currentIndex];
    title.textContent = activeImg.dataset.title;
    desc.textContent = activeImg.dataset.desc;
  }

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
  }

  // Click ảnh để xoay
  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      if (index === (currentIndex + 1) % images.length) {
        next();
      } else if (index === (currentIndex - 1 + images.length) % images.length) {
        prev();
      }
    });
  });

  updateCarousel();