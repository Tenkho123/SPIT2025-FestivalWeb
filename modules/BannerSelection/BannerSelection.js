const slides = document.querySelector('.slides');
const slideCount = document.querySelectorAll('.slide').length;
const dotsContainer = document.querySelector('.dots');

let currentIndexX = 0;
let autoSlide;

// Tạo chấm tròn
for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
    currentIndexX = index;
    slides.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
    resetAutoSlide();
}

function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndexX].classList.add('active');
}

function nextSlide() {
    currentIndexX = (currentIndexX + 1) % slideCount;
    goToSlide(currentIndexX);
}

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 4000);
}

resetAutoSlide();