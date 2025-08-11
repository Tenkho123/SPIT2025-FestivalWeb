const earth = document.querySelector('.earth');
const content = document.getElementById('content');
const text = document.getElementById('text');
const image = document.getElementById('image');

const seasons = [
    { name: 'spring', color: '#77dd77', text: 'Spring: Fresh beginnings!', img: 'https://via.placeholder.com/200/77dd77/ffffff?text=Spring' },
    { name: 'summer', color: '#ffdb58', text: 'Summer: Warm sunshine!', img: 'https://via.placeholder.com/200/ffdb58/ffffff?text=Summer' },
    { name: 'autumn', color: '#ff914d', text: 'Autumn: Golden leaves!', img: 'https://via.placeholder.com/200/ff914d/ffffff?text=Autumn' },
    { name: 'winter', color: '#add8e6', text: 'Winter: Snowy days!', img: 'https://via.placeholder.com/200/add8e6/ffffff?text=Winter' }
];

let isDragging = false;
let startY, earthY;

const topY = 0;
const bottomY = 560;

earth.style.top = topY + 'px';

earth.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    earthY = parseInt(earth.style.top);
    earth.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let dy = e.clientY - startY;
    let newY = Math.min(Math.max(earthY + dy, topY), bottomY);
    earth.style.top = newY + 'px';

    updateSeasonByPosition(newY);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function updateSeasonByPosition(y) {
  let progress = (y - topY) / (bottomY - topY);
  
  // Clamp progress to [0, 0.9999] so we don't skip last index mid-blend
  progress = Math.min(progress, 0.9999);

  let index = Math.floor(progress * seasons.length);
  let nextIndex = Math.min(index + 1, seasons.length - 1);

  // Blend background color
  let color = blendColors(
    hexToRgb(seasons[index].color),
    hexToRgb(seasons[nextIndex].color),
    (progress * seasons.length) % 1
  );
  content.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

  // Fade only current image to 1
  seasons.forEach((_, i) => {
    let imgEl = document.getElementById(`season-${i}`);
    imgEl.style.opacity = (i === index) ? 1 : 0;
  });

  // Update text
  text.textContent = seasons[index].text;
}




function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(h => h + h).join('');
    let bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function blendColors(c1, c2, factor) {
    return {
        r: Math.round(c1.r + (c2.r - c1.r) * factor),
        g: Math.round(c1.g + (c2.g - c1.g) * factor),
        b: Math.round(c1.b + (c2.b - c1.b) * factor)
    };
}

const summerIndex = 1; // Summer
const summerY = (bottomY - topY) * (summerIndex / (seasons.length - 1));
earth.style.top = summerY + 'px';
updateSeasonByPosition(summerY);