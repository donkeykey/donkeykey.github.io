// Terminal-style Portfolio Interactive Effects

// p5.js Particle System
let particles = [];
let particleCount = 60; // Reduced particles
let codeChars = ['0', '1', '{', '}', '(', ')', ';', '=', '+', '-'];
let terminalColors = {
    green: [57, 211, 83],
    white: [230, 237, 243],
    gray: [125, 133, 144]
};

// Matrix Rain Effect
let matrixColumns = [];
let columnCount = 0;
let heroHeight = 0;
let isInHero = false;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('particles-bg');
    
    // Get hero section height
    heroHeight = windowHeight;
    
    // Calculate matrix columns
    columnCount = floor(width / 25); // Less dense columns
    for (let i = 0; i < columnCount; i++) {
        matrixColumns[i] = {
            y: random(-1000, 0),
            speed: random(2, 6), // Slower speed
            chars: []
        };
        
        // Generate random characters for each column
        for (let j = 0; j < 15; j++) { // Fewer chars per column
            matrixColumns[i].chars.push(random(codeChars));
        }
    }
    
    // Initialize floating particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new CodeParticle());
    }
    
    // Set canvas style
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    canvas.style('pointer-events', 'none');
}

function draw() {
    clear();
    
    // Check if we're in hero section for enhanced effects
    updateHeroVisibility();
    
    // Matrix rain effect
    drawMatrixRain();
    
    // Floating particles
    for (let particle of particles) {
        particle.update();
        particle.display();
    }
    
    // Interactive connection lines
    drawConnectionLines();
    
    // Mouse interaction particles
    drawMouseParticles();
    
    // Hero-specific enhanced effects
    if (isInHero) {
        drawHeroEnhancements();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    heroHeight = windowHeight;
    
    // Recalculate matrix columns
    columnCount = floor(width / 25);
    matrixColumns = [];
    for (let i = 0; i < columnCount; i++) {
        matrixColumns[i] = {
            y: random(-1000, 0),
            speed: random(2, 6),
            chars: []
        };
        
        for (let j = 0; j < 15; j++) {
            matrixColumns[i].chars.push(random(codeChars));
        }
    }
}

// Check if current scroll position is in hero
function updateHeroVisibility() {
    let scrollY = window.pageYOffset || 0;
    isInHero = scrollY < heroHeight - 200;
}

// Matrix Rain Effect
function drawMatrixRain() {
    textFont('JetBrains Mono, monospace');
    textSize(14);
    
    for (let i = 0; i < columnCount; i++) {
        let col = matrixColumns[i];
        
        for (let j = 0; j < col.chars.length; j++) {
            let alpha = map(j, 0, col.chars.length - 1, 255, 0);
            
            // More visible in hero section
            if (isInHero) {
                alpha *= 0.8; // Much more visible in hero
            } else {
                alpha *= 0.2; // Subtle elsewhere
            }
            
            if (j === 0) {
                // Brightest character at the front
                fill(...terminalColors.green, alpha * 1.5);
            } else if (j < 3) {
                // Bright trail
                fill(...terminalColors.green, alpha * 1.2);
            } else {
                fill(...terminalColors.green, alpha);
            }
            
            text(col.chars[j], i * 25, col.y + j * 20);
        }
        
        col.y += col.speed;
        
        // Reset column when it goes off screen
        if (col.y > height + 300) {
            col.y = random(-800, -100);
            col.speed = random(2, 6);
            // Refresh characters
            for (let j = 0; j < col.chars.length; j++) {
                col.chars[j] = random(codeChars);
            }
        }
    }
}

// Floating Code Particles
class CodeParticle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-1, 1); // Faster movement
        this.vy = random(-1, 1);
        this.char = random(codeChars);
        this.baseOpacity = random(0.1, 0.5); // Lower base opacity
        this.opacity = this.baseOpacity;
        this.size = random(10, 16); // Smaller size
        this.rotationSpeed = random(-0.02, 0.02);
        this.rotation = 0;
        this.colorIndex = floor(random(Object.keys(terminalColors).length));
        this.glowPhase = random(TWO_PI);
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.glowPhase += 0.03;
        
        // Wrap around edges
        if (this.x < -30) this.x = width + 30;
        if (this.x > width + 30) this.x = -30;
        if (this.y < -30) this.y = height + 30;
        if (this.y > height + 30) this.y = -30;
        
        // Simplified opacity animation
        let opacityMultiplier = isInHero ? 1.2 : 0.4;
        this.opacity = this.baseOpacity * opacityMultiplier;
        this.opacity = constrain(this.opacity, 0.05, 0.6);
    }
    
    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        
        let colorKeys = Object.keys(terminalColors);
        let color = terminalColors[colorKeys[this.colorIndex % colorKeys.length]];
        
        // Enhanced glow effect
        let glowIntensity = sin(this.glowPhase) * 0.3 + 0.7;
        
        // Glow effect for hero section
        if (isInHero && this.opacity > 0.5) {
            // Draw glow
            fill(...color, (this.opacity * 255 * glowIntensity) * 0.3);
            textSize(this.size + 4);
            text(this.char, 0, 0);
        }
        
        // Main character
        fill(...color, this.opacity * 255 * glowIntensity);
        textAlign(CENTER, CENTER);
        textSize(this.size);
        textFont('JetBrains Mono, monospace');
        text(this.char, 0, 0);
        pop();
    }
}

// Simplified Connection Lines
function drawConnectionLines() {
    if (!isInHero) return; // Only show in hero section
    
    let baseAlpha = 30;
    let maxDistance = 150;
    
    for (let i = 0; i < particles.length; i += 2) { // Check fewer particles
        for (let j = i + 2; j < particles.length; j += 2) {
            let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            
            if (d < maxDistance) {
                let alpha = map(d, 0, maxDistance, baseAlpha, 0);
                stroke(...terminalColors.green, alpha);
                strokeWeight(1);
                line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            }
        }
    }
}

// Simplified Mouse Interaction
function drawMouseParticles() {
    if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height && isInHero) {
        // Simple ripple effect only in hero
        let rippleSize = sin(frameCount * 0.1) * 20 + 40;
        
        noFill();
        stroke(...terminalColors.green, 80);
        strokeWeight(2);
        ellipse(mouseX, mouseY, rippleSize);
        
        // Subtle particle attraction
        let attractionRadius = 100;
        let forceMultiplier = 0.003;
        
        for (let particle of particles) {
            let d = dist(mouseX, mouseY, particle.x, particle.y);
            if (d < attractionRadius) {
                let force = map(d, 0, attractionRadius, forceMultiplier, 0);
                let angle = atan2(mouseY - particle.y, mouseX - particle.x);
                particle.vx += cos(angle) * force;
                particle.vy += sin(angle) * force;
                
                // Limit velocity
                particle.vx = constrain(particle.vx, -2, 2);
                particle.vy = constrain(particle.vy, -2, 2);
            }
        }
    }
}

// Simplified Hero Enhancement
function drawHeroEnhancements() {
    // Simple floating dots
    let time = frameCount * 0.005;
    
    for (let i = 0; i < 3; i++) {
        let x = width * 0.15 + sin(time + i) * 60;
        let y = height * 0.25 + cos(time + i * 0.5) * 40;
        
        fill(...terminalColors.green, 60);
        noStroke();
        ellipse(x, y, 4);
    }
}

// Project data storage
let projectsData = {};

// Load project data
async function loadProjectData() {
    try {
        const response = await fetch('/projects.json');
        projectsData = await response.json();
        return projectsData;
    } catch (error) {
        console.error('Failed to load project data:', error);
        return {};
    }
}

// Show project modal
function showProjectModal(projectId) {
    console.log('Attempting to show modal for:', projectId);
    console.log('Available projects:', Object.keys(projectsData));
    const project = projectsData[projectId];
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    console.log('Project found:', project);
    
    // Create modal HTML
    const modalHTML = `
        <div class="project-modal-overlay" onclick="closeProjectModal()">
            <div class="project-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeProjectModal()">×</button>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${project.title}</h2>
                        <p class="modal-subtitle">${project.subtitle}</p>
                        <span class="modal-category">${project.category}</span>
                    </div>
                    ${project.images.length > 0 ? `
                        <div class="modal-image">
                            <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
                        </div>
                    ` : ''}
                    <div class="modal-body">
                        <div class="modal-description">
                            <h3>概要</h3>
                            <p>${project.description}</p>
                        </div>
                        ${project.awards.length > 0 ? `
                            <div class="modal-awards">
                                <h3>受賞歴</h3>
                                <div class="awards">
                                    ${project.awards.map(award => `<span class="award">${award}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div class="modal-details">
                            <div class="detail-row">
                                <strong>役割:</strong> ${project.role}
                            </div>
                            <div class="detail-row">
                                <strong>年度:</strong> ${project.year}
                            </div>
                            <div class="detail-row">
                                <strong>技術:</strong> ${project.technologies.join(', ')}
                            </div>
                        </div>
                        ${Object.keys(project.links).length > 0 ? `
                            <div class="modal-links">
                                ${Object.entries(project.links).map(([key, url]) => {
                                    const linkText = key === 'project' ? 'プロジェクトページ' : 
                                                   key === 'website' ? 'ウェブサイト' : 
                                                   key === 'portfolio' ? 'ポートフォリオ' : key;
                                    return `<a href="${url}" target="_blank" class="btn-primary">${linkText}</a>`;
                                }).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Update URL without page reload
    const newUrl = `/projects/${projectId}`;
    history.pushState({projectId}, '', newUrl);
}

// Close project modal
function closeProjectModal() {
    const modal = document.querySelector('.project-modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
        // Return to main page URL
        history.pushState({}, '', '/');
    }
}

// Handle back/forward browser buttons
window.addEventListener('popstate', function(e) {
    const modal = document.querySelector('.project-modal-overlay');
    if (modal) {
        closeProjectModal();
    } else if (e.state && e.state.projectId) {
        showProjectModal(e.state.projectId);
    }
});

// Check for portfolio redirect immediately on page load
(function() {
    const path = window.location.pathname;
    const portfolioMatch = path.match(/^\/portfolio\/(.+)$/);
    if (portfolioMatch) {
        const projectId = portfolioMatch[1];
        window.location.replace(`/projects/${projectId}`);
        return;
    }
})();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Load project data
    await loadProjectData();
    console.log('Project data loaded:', Object.keys(projectsData).length, 'projects');
    
    // Project filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // Add click handlers to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            console.log('Card clicked, projectId:', projectId);
            if (projectId) {
                showProjectModal(projectId);
            } else {
                console.error('No projectId found on card');
            }
        });
        
        // Also handle clicks on project title links
        const titleLink = card.querySelector('.project-content h4 a');
        if (titleLink) {
            titleLink.addEventListener('click', function(e) {
                e.preventDefault();
                const projectId = card.getAttribute('data-project');
                if (projectId) {
                    showProjectModal(projectId);
                }
            });
        }
    });
    
    // Handle direct project URLs - improved version
    function handleDirectProjectAccess() {
        const path = window.location.pathname;
        console.log('Checking direct access for path:', path);
        const projectMatch = path.match(/^\/projects\/(.+)$/);
        const portfolioMatch = path.match(/^\/portfolio\/(.+)$/);
        
        if (portfolioMatch) {
            const projectId = portfolioMatch[1];
            console.log('Redirecting portfolio URL to projects:', projectId);
            // Immediate redirect to new URL
            window.location.replace(`/projects/${projectId}`);
            return;
        }
        
        if (projectMatch) {
            const projectId = projectMatch[1];
            console.log('Found project URL, projectId:', projectId);
            
            // Function to check and show modal with max retry limit
            let retryCount = 0;
            const maxRetries = 50; // 5 seconds max wait
            const tryShowModal = () => {
                console.log(`Trying to show modal for ${projectId}, attempt ${retryCount + 1}`);
                if (projectsData[projectId]) {
                    console.log('Project data found, showing modal');
                    showProjectModal(projectId);
                } else if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(tryShowModal, 100);
                } else {
                    console.error('Failed to load project data after maximum retries');
                }
            };
            
            // Start trying to show modal
            tryShowModal();
        }
    }
    
    // Call the function initially and after data is loaded
    handleDirectProjectAccess();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effects
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;

        // Update header background opacity
        if (scrollTop > 50) {
            header.style.background = 'rgba(13, 17, 23, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(13, 17, 23, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.section');
    animateElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightCurrentSection() {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection(); // Run on load

    // Card hover effects with terminal-style animations
    const cards = document.querySelectorAll('.project-card, .info-card, .skill-category, .contact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
            
            // Add terminal glow effect
            if (this.classList.contains('project-card')) {
                this.style.borderColor = 'var(--terminal-green)';
            } else if (this.classList.contains('skill-category')) {
                this.style.borderColor = 'var(--terminal-cyan)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            this.style.borderColor = 'var(--border-color)';
        });
    });

    // Skill tag hover effects
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.background = 'var(--terminal-green)';
            this.style.color = 'var(--bg-primary)';
            this.style.boxShadow = '0 0 15px rgba(57, 211, 83, 0.4)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'var(--bg-secondary)';
            this.style.color = 'var(--text-primary)';
            this.style.boxShadow = 'none';
        });
    });

    // Terminal cursor animation for nav brand
    const terminalCursor = document.querySelector('.terminal-cursor');
    if (terminalCursor) {
        setInterval(() => {
            terminalCursor.style.opacity = terminalCursor.style.opacity === '0' ? '1' : '0';
        }, 1000);
    }

    // Typing animation is handled by CSS

    // External links handling
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Scroll to top functionality
    let scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid var(--terminal-green);
        background: var(--bg-tertiary);
        color: var(--terminal-green);
        font-size: 20px;
        font-family: var(--font-mono);
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(57, 211, 83, 0.3);
    `;

    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--terminal-green)';
        this.style.color = 'var(--bg-primary)';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(57, 211, 83, 0.4)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.background = 'var(--bg-tertiary)';
        this.style.color = 'var(--terminal-green)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(57, 211, 83, 0.3)';
    });

    // Show/hide scroll to top button
    function toggleScrollToTop() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }

    window.addEventListener('scroll', toggleScrollToTop);

    // Performance optimization: debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll handlers
    const debouncedScroll = debounce(() => {
        highlightCurrentSection();
        toggleScrollToTop();
    }, 10);

    window.addEventListener('scroll', debouncedScroll);

    // Add terminal boot-up effect
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    console.log('%c$ portfolio --loaded', 'color: #39d353; font-family: JetBrains Mono; font-size: 14px;');
    console.log('%cWelcome to Daichi Kawashima\'s portfolio terminal.', 'color: #e6edf3; font-family: JetBrains Mono; font-size: 12px;');
    console.log('%cType "help" for available commands... (just kidding!)', 'color: #7d8590; font-family: JetBrains Mono; font-size: 12px;');
});