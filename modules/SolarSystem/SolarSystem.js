const earth = document.querySelector('.earth');
const content = document.getElementById('content');
const text = document.getElementById('text');

const seasons = [
    { name: 'spring', color: '#77dd77', text: 'Spring: Fresh beginnings!', img: 'https://via.placeholder.com/200/77dd77/ffffff?text=Spring' },
    { name: 'summer', color: '#ffdb58', text: 'Summer: Warm sunshine!', img: 'https://via.placeholder.com/200/ffdb58/ffffff?text=Summer' },
    { name: 'autumn', color: '#ff914d', text: 'Autumn: Golden leaves!', img: 'https://via.placeholder.com/200/ff914d/ffffff?text=Autumn' },
    { name: 'winter', color: '#add8e6', text: 'Winter: Snowy days!', img: 'https://via.placeholder.com/200/add8e6/ffffff?text=Winter' }
];

let isDragging = false;
let startY, earthY;

const sidebar = document.querySelector(".sidebar");
let topY = 0;
let bottomY = 0;
let lastSizeCategory = null; // "mobile" or "desktop"

function updateBottomY() {
    if (!sidebar) return;
    bottomY = sidebar.offsetHeight - 60;
}

function checkAndUpdateBottomY() {
    const sizeCategory = window.innerWidth <= 767 ? "mobile" : "desktop";
    if (sizeCategory !== lastSizeCategory) {
        lastSizeCategory = sizeCategory;
        updateBottomY();
        console.log(`bottomY recalculated for ${sizeCategory}:`, bottomY);
    }
}

checkAndUpdateBottomY();

// Recalculate on resize
window.addEventListener("resize", checkAndUpdateBottomY);

earth.style.top = topY + 'px';

// Start: Change season with sidebar


sidebar.addEventListener('click', (e) => {
    handleSidebarClick(e.clientY);
});

sidebar.addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevent scrolling on touch devices
    handleSidebarClick(e.touches[0].clientY);
}, { passive: false });

function handleSidebarClick(clientY) {
    const rect = sidebar.getBoundingClientRect();
    const relativeY = clientY - rect.top;  // position relative to sidebar top
    const clampedY = Math.min(Math.max(relativeY, 0), rect.height); // clamp inside sidebar

    // Calculate proportion along sidebar height
    const progress = clampedY / rect.height;

    // Map progress to nearest season index
    const index = Math.round(progress * (seasons.length - 1));

    setSeasonByIndex(index);
}

function setSeasonByIndex(index) {
    const newY = topY + ((bottomY - topY) * index) / (seasons.length - 1);

    earth.style.transition = 'top 0.3s ease';
    earth.style.top = newY + 'px';

    updateSeasonByPosition(newY);
}
// End: Change season with sidebar

// Utility to get Y position from mouse or touch event
function getClientY(e) {
    if (e.type.startsWith('touch')) {
        return e.touches[0].clientY;
    }
    return e.clientY;
}

// Start dragging
function dragStart(e) {
    isDragging = true;
    startY = getClientY(e);
    earthY = parseInt(earth.style.top);
    earth.style.transition = 'none';
    e.preventDefault(); // Prevent scrolling on touch devices while dragging
}

// During dragging
function dragMove(e) {
    if (!isDragging) return;
    let currentY = getClientY(e);
    let dy = currentY - startY;
    let newY = Math.min(Math.max(earthY + dy, topY), bottomY);
    earth.style.top = newY + 'px';

    updateSeasonByPosition(newY);
    e.preventDefault();
}

// End dragging
function dragEnd(e) {
    isDragging = false;
}

earth.addEventListener('mousedown', dragStart);
earth.addEventListener('touchstart', dragStart);

document.addEventListener('mousemove', dragMove);
document.addEventListener('touchmove', dragMove, { passive: false });

document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchend', dragEnd);
document.addEventListener('touchcancel', dragEnd);

// ... rest of your code remains unchanged ...

// function updateSeasonByPosition(y) {
//   let progress = (y - topY) / (bottomY - topY);
//   progress = Math.min(progress, 0.9999);
//   let index = Math.floor(progress * seasons.length);
//   let nextIndex = Math.min(index + 1, seasons.length - 1);

//   let color = blendColors(
//     hexToRgb(seasons[index].color),
//     hexToRgb(seasons[nextIndex].color),
//     (progress * seasons.length) % 1
//   );
//   content.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

//   seasons.forEach((_, i) => {
//     let imgEl = document.getElementById(`season-${i}`);
//     if (imgEl) imgEl.style.opacity = (i === index) ? 1 : 0;
//   });

//   text.textContent = seasons[index].text;
// }

function updateSeasonByPosition(y) {
    let progress = (y - topY) / (bottomY - topY);
    progress = Math.min(progress, 0.9999);
    let index = Math.floor(progress * seasons.length);

    // Update background color class on content
    content.className = 'content ' + seasons[index].name;

    // Show/hide text blocks
    seasons.forEach((season, i) => {
        const textDiv = document.getElementById(`${season.name}-text`);
        const img = document.getElementById(`${season.name}-img`);
        if (textDiv) textDiv.style.display = (i === index) ? 'block' : 'none';
        if (img) img.style.display = (i === index) ? 'block' : 'none';
    });

    seasons.forEach((_, i) => {
        let imgEl = document.getElementById(`season-${i}`);
        if (imgEl) imgEl.style.opacity = (i === index) ? 1 : 0;
    });
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

// ---------------------------
// helper: parse dd/mm/yyyy strings (returns Date)
function parseDMY(dateStr) {
    const parts = dateStr.split('/');
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    return new Date(y, m, d);
}

// scroll a row into the scrollable container and center it
function scrollRowIntoContainer(row, container) {
    if (!row || !container) return;
    const rowRect = row.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const offset = rowRect.top - contRect.top;
    const target = container.scrollTop + offset - (container.clientHeight / 2) + (row.clientHeight / 2);
    container.scrollTo({ top: target, behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", function () {
  const rows = document.querySelectorAll(".season-table-row");
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignore time

  rows.forEach((row) => {
    const dateCell = row.querySelector(".col-time");
    if (!dateCell) return;

    const raw = dateCell.textContent
      .replace(/\u00A0/g, " ") // replace NBSP with space
      .trim();

    let startDate, endDate;

    // Check for date range (e.g. "06/08/2025 – 18/08/2025")
    const rangeMatch = raw.match(
      /(\d{2})\/(\d{2})\/(\d{4})\s*(?:–|—|-|to)\s*(\d{2})\/(\d{2})\/(\d{4})/
    );

    if (rangeMatch) {
      startDate = new Date(
        rangeMatch[3],
        parseInt(rangeMatch[2], 10) - 1,
        rangeMatch[1]
      );
      endDate = new Date(
        rangeMatch[6],
        parseInt(rangeMatch[5], 10) - 1,
        rangeMatch[4]
      );
    } else {
      // Single date case (e.g. "03/10/2025")
      const singleMatch = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (singleMatch) {
        startDate = new Date(
          singleMatch[3],
          parseInt(singleMatch[2], 10) - 1,
          singleMatch[1]
        );
        endDate = new Date(startDate); // same day
      }
    }

    if (!startDate || !endDate) return;

    // Normalize times
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Highlight if today is between start and end
    if (today >= startDate && today <= endDate) {
      row.classList.add("current-event");
    }
  });
});

// (function debugHighlightCurrentEvents() {
//   const rows = document.querySelectorAll('.season-table-row');
//   console.log('Found rows:', rows.length);

//   const today = new Date();
//   today.setHours(0,0,0,0); // compare date-only

//   // robust parser for strings like:
//   // "06/08/2025 – 18/08/2025", "15/12 – 18/12/2025", "03/10/2025", etc.
//   function parseFlexibleDateRange(text) {
//     if (!text) return null;
//     text = text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim(); // normalize spaces & NBSP

//     // Range with optional years on either side:
//     // captures: d1/m1(/y1)?  sep  d2/m2(/y2)?
//     const rangeRegex = /(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?\s*(?:–|—|-|to)\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/i;
//     const r = text.match(rangeRegex);
//     if (r) {
//       let d1 = parseInt(r[1],10), m1 = parseInt(r[2],10), y1 = r[3] ? parseInt(r[3],10) : null;
//       let d2 = parseInt(r[4],10), m2 = parseInt(r[5],10), y2 = r[6] ? parseInt(r[6],10) : null;

//       // infer missing years
//       if (!y1 && y2) y1 = y2;
//       if (!y2 && y1) y2 = y1;
//       if (!y1 && !y2) {
//         y1 = y2 = (new Date()).getFullYear();
//       }

//       let start = new Date(y1, m1 - 1, d1);
//       start.setHours(0,0,0,0);
//       let end = new Date(y2, m2 - 1, d2);
//       end.setHours(23,59,59,999);

//       // if start > end, assume range crosses year boundary -> add 1 year to end
//       if (start > end) end.setFullYear(end.getFullYear() + 1);

//       return { start, end };
//     }

//     // single date with year
//     const singleRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
//     const s = text.match(singleRegex);
//     if (s) {
//       const start = new Date(parseInt(s[3],10), parseInt(s[2],10)-1, parseInt(s[1],10));
//       start.setHours(0,0,0,0);
//       const end = new Date(start);
//       end.setHours(23,59,59,999);
//       return { start, end };
//     }

//     return null; // couldn't parse
//   }

//   rows.forEach((row, i) => {
//     const dateCell = row.querySelector('.col-time');
//     const raw = dateCell ? dateCell.textContent.trim() : '';
//     console.log(`Row ${i}: raw text -> "${raw}"`);

//     const parsed = parseFlexibleDateRange(raw);
//     if (!parsed) {
//       console.warn(`Row ${i}: could not parse date string: "${raw}"`);
//       // Visual debug: mark unparsed rows
//       row.style.outline = '2px dashed orange';
//       return;
//     }

//     console.log(`Row ${i}: parsed start=${parsed.start.toISOString()} end=${parsed.end.toISOString()}`);
//     const isCurrent = today >= parsed.start && today <= parsed.end;
//     console.log(`Row ${i}: isCurrent=${isCurrent}`);

//     if (isCurrent) {
//       // add class and a visible outline while debugging
//       row.classList.add('current-event');
//       row.style.outline = '3px solid red';         // temporary debug highlight
//       row.style.transition = 'box-shadow .2s';
//     }
//   });

//   // optional: scroll to the first current event
//   const first = document.querySelector('.season-table-row.current-event');
//   if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });

// })();