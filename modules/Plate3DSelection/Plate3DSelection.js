document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const plate_carousel = document.getElementById("memory-plate-carousel");
    const plate_cards = document.querySelectorAll(".memory-plate-card");
    const platePrevBtn = document.getElementById("prev-plate-btn");
    const plateNextBtn = document.getElementById("next-plate-btn");

    // Variables
    let currentIndexP = 0;
    let startXP, startYP;
    let isDraggingP = false;
    let thetaP = 0;
    // let radiusP = window.innerWidth <= 768 ? 250 : 400;
    let radiusP = 400;
    const totalCardsP = plate_cards.length;

    // Initialize
    function init() {
        arrangeCards();
        rotateCarousel();

        platePrevBtn.addEventListener("click", prevCard);
        plateNextBtn.addEventListener("click", nextCard);
        plate_cards.forEach((card) => {
            card.addEventListener("click", flipCard);
        });

        plate_carousel.addEventListener("mousedown", dragStart);
        plate_carousel.addEventListener("touchstart", dragStart, { passive: true });
        document.addEventListener("mousemove", drag);
        document.addEventListener("touchmove", drag, { passive: false });
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);

        document.addEventListener("keydown", handleKeyDown);

        playAmbientSound();
    }

    // Arrange plate_cards in a circle
    function arrangeCards() {
        const angle = 360 / totalCardsP;
        plate_cards.forEach((card, index) => {
            // Calculate the angle for this card
            const cardAngle = angle * index;
            // Convert to radians
            const rad = (cardAngle * Math.PI) / 180;
            // Calculate position
            const x = radiusP * Math.sin(rad);
            const z = radiusP * Math.cos(rad) * -1;

            // Apply transform
            card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radiusP}px)`;

            // Store the card's index
            card.dataset.index = index;
        });
    }

    // Rotate plate_carousel
    function rotateCarousel() {
        plate_carousel.style.transform = `rotateY(${thetaP}deg)`;

        const step = 360 / totalCardsP;

        // Correct index for both positive & negative thetaP
        currentIndexP = ((Math.round(-thetaP / step) % totalCardsP) + totalCardsP) % totalCardsP;


        // Show paragraph only for active card
        plate_cards.forEach((card, index) => {
            if (index === currentIndexP) {
                card.querySelector('.card-plate-content')?.classList.add('visible');
            } else {
                card.querySelector('.card-plate-content')?.classList.remove('visible');
            }
        });
    }


    // Next card
    function nextCard() {
        thetaP -= 360 / totalCardsP; // Changed direction to match swipe
        rotateCarousel();
    }

    // Previous card
    function prevCard() {
        thetaP += 360 / totalCardsP; // Changed direction to match swipe
        rotateCarousel();
    }

    // Flip card
    function flipCard(e) {
        const card = e.currentTarget;
        const cardIndex = parseInt(card.dataset.index);

        // Only flip the current front-facing card
        if (cardIndex === currentIndexP) {
            card.classList.toggle("flipped");
        }
    }

    // Drag functions
    function dragStart(e) {
        // e.preventDefault(); Prevent default behavior
        isDraggingP = true;
        startXP = e.pageX || e.touches[0].pageX;
    }

    function drag(e) {
        if (!isDraggingP) return;
        // e.preventDefault(); Prevent default scrolling

        const currentX = e.pageX || (e.touches ? e.touches[0].pageX : startXP);
        const diffX = currentX - startXP;

        // Rotate based on drag distance - FIXED DIRECTION
        const sensitivity = 0.1;
        const newthetaP = thetaP + diffX * sensitivity;

        plate_carousel.style.transform = `rotateY(${newthetaP}deg)`;
    }

    function dragEnd(e) {
        if (!isDraggingP) return;
        isDraggingP = false;

        const currentX =
            e.pageX || (e.changedTouches ? e.changedTouches[0].pageX : startXP);
        const diffX = currentX - startXP;

        // FIXED DIRECTION: If swiping right, show previous card (thetaP increases)
        // If swiping left, show next card (thetaP decreases)
        if (Math.abs(diffX) > 20) {
            if (diffX > 0) {
                prevCard(); // Swipe right to see previous card
            } else {
                nextCard(); // Swipe left to see next card
            }
        } else {
            // Snap to the closest card
            const anglePerCard = 360 / totalCardsP;
            const snapAngle = Math.round(thetaP / anglePerCard) * anglePerCard;
            thetaP = snapAngle;
            rotateCarousel();
        }
    }

    // Keyboard navigation
    function handleKeyDown(e) {
        if (e.key === "ArrowLeft") {
            nextCard(); // Changed to match swipe direction
        } else if (e.key === "ArrowRight") {
            prevCard(); // Changed to match swipe direction
        } else if (e.key === "Enter" || e.key === " ") {
            const currentCard = document.querySelector(
                `.memory-plate-card[data-index="${currentIndexP}"]`
            );
            if (currentCard) {
                currentCard.classList.toggle("flipped");
            }
        }
    }

    // Play ambient sound
    function playAmbientSound() {
        // Optional: Add ambient sound if needed
    }

    init();

    plate_cards.forEach((card, index) => {
        if (index === currentIndexP) {
            card.querySelector('.card-plate-content')?.classList.add('visible');
        } else {
            card.querySelector('.card-plate-content')?.classList.remove('visible');
        }
    });
});

