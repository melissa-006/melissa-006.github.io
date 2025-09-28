// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Scroll animations
const hiddenElements = document.querySelectorAll('.hidden');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

hiddenElements.forEach(el => observer.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Copy email
const copyEmailBtn = document.getElementById('copy-email');
const emailAddressSpan = document.getElementById('email-address');
if (copyEmailBtn && emailAddressSpan) {
  copyEmailBtn.addEventListener('click', () => {
    const email = emailAddressSpan.textContent;
    navigator.clipboard.writeText(email);
    copyEmailBtn.textContent = "✅";
    setTimeout(() => { copyEmailBtn.textContent = "📋"; }, 2000);
  });
}

// Gallery Lightbox with navigation + captions + swipe + transitions
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <span class="close-btn">&times;</span>
  <span class="nav-btn prev-btn">&#10094;</span>
  <img src="" alt="Expanded Photo">
  <p class="caption"></p>
  <span class="nav-btn next-btn">&#10095;</span>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const caption = lightbox.querySelector('.caption');
const closeBtn = lightbox.querySelector('.close-btn');
const prevBtn = lightbox.querySelector('.prev-btn');
const nextBtn = lightbox.querySelector('.next-btn');

let currentIndex = 0;

function showImage(index, direction = 'right') {
  if (index < 0) index = galleryItems.length - 1;
  if (index >= galleryItems.length) index = 0;

  currentIndex = index;

  // Fade-out animation depending on direction
  lightboxImg.classList.add(direction === 'right' ? 'fade-out-right' : 'fade-out-left');

  setTimeout(() => {
    // Update image + caption
    lightboxImg.src = galleryItems[currentIndex].src;
    caption.textContent = galleryItems[currentIndex].alt || "";

    // Remove fade-out and add fade-in
    lightboxImg.classList.remove('fade-out-right', 'fade-out-left');
    lightboxImg.classList.add('fade-in');

    setTimeout(() => {
      lightboxImg.classList.remove('fade-in');
    }, 400);
  }, 300);

  lightbox.style.display = 'flex';
}

// Open clicked image
galleryItems.forEach((img, index) => {
  img.addEventListener('click', () => showImage(index, 'right'));
});

// Navigation
prevBtn.addEventListener('click', () => showImage(currentIndex - 1, 'left'));
nextBtn.addEventListener('click', () => showImage(currentIndex + 1, 'right'));

// Close lightbox
closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1, 'left');
    if (e.key === 'ArrowRight') showImage(currentIndex + 1, 'right');
    if (e.key === 'Escape') lightbox.style.display = 'none';
  }
});

// Touch (swipe) navigation for mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) {
    showImage(currentIndex + 1, 'right'); // Swipe left → next
  }
  if (touchEndX > touchStartX + 50) {
    showImage(currentIndex - 1, 'left'); // Swipe right → prev
  }
});

// Hamburger Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !isExpanded);
  menu.classList.toggle('show');
});

// Close menu when clicking on a link
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
    menu.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Scrolling Banner
  // Wrap the banner text in a span for animation
  const banner = document.getElementById("banner");
  if (banner) {
    banner.innerHTML = `<span>${banner.innerHTML} ${banner.innerHTML}</span>`;
    banner.innerHTML = `<span>${banner.innerHTML} ${banner.innerHTML}</span>`;

    // Optional: Pause on hover
    const span = banner.querySelector("span");
    banner.addEventListener("mouseenter", () => {
      span.style.animationPlayState = "paused";
    });
    banner.addEventListener("mouseleave", () => {
      span.style.animationPlayState = "running";
    });
  }
});

// Hobbies Modal
const hobbies = {
  'sports': {
    title: 'Sports',
    content: '<p>Sports keep me active, energetic, and disciplined.</p><ul><li><strong>Basketball</strong> is my favorite team sport — I love the strategy, speed, and excitement of every game. I\’m also a proud member of my college basketball team, which has given me opportunities to compete, collaborate, and grow alongside teammates.</li><li><strong>Boxing</strong> is my go-to workout for focus and strength. It\’s intense, motivating, and an amazing stress-buster.</li></ul>'
  },
  'clay-modelling': {
    title: 'Clay Modelling',
    content: '<p>I\’ve recently started experimenting with clay modelling and I\’m still learning the craft. It\’s a fun, hands-on way to explore creativity, even if things get a little messy. I\’ve attached a few of my early works in this section.</p><img data-src="images/clay work1.jpg" class="lazy" src="" alt="Clay Work 1" style="max-width:100%; height:auto; margin:10px 0;"><img data-src="images/clay work2.jpg" class="lazy" src="" alt="Clay Work 2" style="max-width:100%; height:auto; margin:10px 0;">'
  },
  'digital-art': {
    title: 'Digital Art',
    content: '<p>I\’m just starting out with digital art and experimenting with different tools and styles. It\’s a beginner\’s journey for me, but I enjoy sketching and creating whenever inspiration strikes. A few of my works are attached here as well.</p><img data-src="images/eye digital painting .png" class="lazy" src="" alt="Eye Digital Painting" style="max-width:100%; height:auto; margin:10px 0;"><img data-src="images/DRAWINGS 2.jpg" class="lazy" src="" alt="Drawings 2" style="max-width:100%; height:auto; margin:10px 0;">'
  },
  'travelling': {
    title: 'Travelling',
    content: '<p>Travelling gives me fresh perspectives and new stories to carry back. I enjoy discovering new places, experiencing cultures, and finding the little moments that make each trip special.</p><p>Countries I’ve visited so far:</p><ul><li>USA: Washington, New York City, Florida</li><li>Australia: Sydney</li><li>China: Shanghai, Beijing</li><li>Azerbaijan</li><li>Singapore</li><li>Thailand: Bangkok, Phuket</li><li>Hong Kong</li></ul>'
  },
  'anime': {
    title: 'Anime',
    content: '<p>Anime is something I watch for pure fun and relaxation. The creativity in its storytelling and visuals always fascinates me. Some of my favorites are <strong>Jujutsu Kaisen</strong>, <strong>Haikyuu!!</strong>, and <strong>Chainsaw Man</strong> — each different, but all equally entertaining.</p>'
  },
  'photography': {
    title: 'Photography',
    content: '<p>Photography helps me slow down and notice the details in everyday life. I love capturing moments, moods, and perspectives through the lens. To explore more, check out my <strong>Gallery</strong> where I\’ve shared some of my shots.</p>'
  }
};

const hobbyButtons = document.querySelectorAll('.hobby-btn');
const hobbyModal = document.getElementById('hobby-modal');
const modalBody = document.getElementById('modal-body');
const hobbyCloseBtn = document.querySelector('.close');

hobbyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const hobby = button.getAttribute('data-hobby');
    const data = hobbies[hobby];
    modalBody.innerHTML = `<h3>${data.title}</h3>${data.content}`;
    const modalLazyImages = modalBody.querySelectorAll('img.lazy');
    modalLazyImages.forEach(img => imageObserver.observe(img));
    hobbyModal.style.display = 'flex';
  });
});

if (hobbyCloseBtn) {
  hobbyCloseBtn.addEventListener('click', () => {
    hobbyModal.style.display = 'none';
  });
}

if (hobbyModal) {
  hobbyModal.addEventListener('click', (e) => {
    if (e.target === hobbyModal) {
      hobbyModal.style.display = 'none';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hobbyModal.style.display === 'flex') {
    hobbyModal.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('Gallery DOMContentLoaded started');
  const gallerySection = document.querySelector('#gallery');
  console.log('Gallery section found:', !!gallerySection);
  if (gallerySection) {
    const galleryGrid = gallerySection.querySelector('.grid');
    const loadingSpinner = gallerySection.querySelector('.loading-spinner');
    const galleryImages = gallerySection.querySelectorAll('.gallery-item img');
    console.log('Total images found:', galleryImages.length);

    let loadedCount = 0;
    const totalImages = galleryImages.length;

    // Function to check if all images are loaded
    const checkAllLoaded = () => {
      console.log('checkAllLoaded called, count:', loadedCount, '/', totalImages);
      if (loadedCount === totalImages) {
        console.log('All images loaded, hiding spinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (galleryGrid) galleryGrid.style.display = 'block';
      }
    };

    // If no images, show grid immediately
    if (totalImages === 0) {
      if (loadingSpinner) loadingSpinner.style.display = 'none';
      if (galleryGrid) galleryGrid.style.display = 'block';
      return;
    }

    // Add load and error listeners to each image
    galleryImages.forEach(img => {
      console.log('Adding listeners to image:', img.src);
      if (img.complete) {
        loadedCount++;
        console.log('Image complete:', loadedCount);
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          console.log('Image loaded:', loadedCount, '/', totalImages);
          checkAllLoaded();
        });
        img.addEventListener('error', () => {
          loadedCount++; // Count errors as loaded to avoid hanging
          console.log('Image error:', loadedCount, '/', totalImages);
          checkAllLoaded();
        });
      }
    });

    // Fallback check for broken images (events may not fire)
    setTimeout(() => {
      console.log('Checking for broken images');
      galleryImages.forEach(img => {
        if (!img.complete && img.naturalWidth === 0) {
          loadedCount++;
          console.log('Detected broken image:', loadedCount, '/', totalImages);
          checkAllLoaded();
        }
      });
    }, 100);

    // Check initially in case some are already loaded
    checkAllLoaded();
    console.log('Initial loadedCount:', loadedCount, '/', totalImages);

    // Fallback timeout to hide spinner if images fail to load
    setTimeout(() => {
      console.log('Timeout triggered, hiding spinner');
      if (loadingSpinner && galleryGrid) {
        loadingSpinner.style.display = 'none';
        galleryGrid.style.display = 'block';
      }
    }, 5000); // 5 seconds

    // Observe gallery images for lazy loading if needed
    galleryImages.forEach(img => {
      if (img.classList.contains('lazy')) {
        imageObserver.observe(img);
      }
    });
  }
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img.lazy');
  lazyImages.forEach(img => imageObserver.observe(img));
});
