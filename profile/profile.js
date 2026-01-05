// ===========================
// Data Fetching
// ===========================
async function loadData() {
    try {
        const [profileData, projectsData] = await Promise.all([
            fetch('/profile/profile-data.json').then(r => r.json()),
            fetch('/projects.json').then(r => r.json())
        ]);
        return { profileData, projectsData };
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// ===========================
// Render Functions
// ===========================

// ===========================
// Typing Effect
// ===========================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Add blinking cursor after typing completes
            element.style.borderRight = '3px solid var(--terminal-green)';
            element.style.animation = 'blink-caret 0.75s step-end infinite';
        }
    }

    type();
}

// Slide 1: 基本情報
function renderBasicInfo(basicInfo) {
    const nameEl = document.getElementById('profile-name');
    const titleEl = document.getElementById('profile-title');
    const socialEl = document.getElementById('profile-social');

    if (nameEl) {
        const fullName = `${basicInfo.name} | ${basicInfo.nameEn}`;
        typeWriter(nameEl, fullName, 80);
    }
    if (titleEl) {
        titleEl.textContent = basicInfo.title;
    }
    if (socialEl) {
        socialEl.innerHTML = `
            <a href="${basicInfo.social.twitter}" target="_blank" rel="noopener noreferrer" class="social-link">Twitter</a>
            <a href="${basicInfo.social.portfolio}" target="_blank" rel="noopener noreferrer" class="social-link">Portfolio</a>
            <a href="${basicInfo.social.business}" target="_blank" rel="noopener noreferrer" class="social-link">Business</a>
        `;
    }
}

// Slide 2: 個人情報（年齢・家族）
function renderPersonalInfo(basicInfo) {
    const personalEl = document.getElementById('personal-info');
    if (!personalEl) return;

    personalEl.innerHTML = `
        <div class="personal-info-item">
            <span class="personal-icon">🎂</span>
            <p>${basicInfo.age}</p>
        </div>
        <div class="personal-info-item">
            <span class="personal-icon">📍</span>
            <p>${basicInfo.birthplace}</p>
        </div>
        <div class="personal-info-item">
            <span class="personal-icon">👨‍👩‍👧</span>
            <p>${basicInfo.family}</p>
        </div>
    `;
}

// Slide 2: 趣味・パーソナル
function renderHobbies(hobbies) {
    const gridEl = document.getElementById('hobbies-grid');
    if (!gridEl) return;

    const html = hobbies.map(hobby => `
        <div class="hobby-card">
            <div class="hobby-icon">${hobby.icon}</div>
            <div class="hobby-title">${hobby.title}</div>
            <div class="hobby-description">${hobby.description}</div>
        </div>
    `).join('');

    gridEl.innerHTML = html;
}

// Slide 3: 経歴
function renderCareer(career) {
    const timelineEl = document.getElementById('career-timeline');
    if (!timelineEl) return;

    const html = career.map(item => `
        <div class="career-item">
            <div class="career-period">${item.period}</div>
            <div class="career-company">${item.company}</div>
            <div class="career-position">${item.position}</div>
            <div class="career-description">${item.description}</div>
        </div>
    `).join('');

    timelineEl.innerHTML = html;
}

// Slide 4-6: メインプロジェクト
function renderMainProject(project, elementId) {
    const el = document.getElementById(elementId);
    if (!el || !project) return;

    const awardsHtml = project.awards && project.awards.length > 0
        ? `<div class="project-awards">
            ${project.awards.map(award => `<span class="award-badge">🏆 ${award}</span>`).join('')}
           </div>`
        : '';

    const techHtml = project.technologies && project.technologies.length > 0
        ? `<div class="project-technologies">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
           </div>`
        : '';

    el.innerHTML = `
        <div class="project-image">
            <img src="${project.images[0]}" alt="${project.title}">
        </div>
        <h2 class="project-title">${project.title}</h2>
        <p class="project-subtitle">${project.subtitle}</p>
        <p class="project-description">${project.description}</p>
        ${awardsHtml}
        ${techHtml}
    `;
}

// Slide 7: その他プロジェクト
function renderOtherProjects(projects) {
    const containerEl = document.getElementById('other-projects');
    if (!containerEl) return;

    const html = projects.map(project => `
        <div class="other-project-card">
            <img src="${project.images[0]}" alt="${project.title}" class="other-project-image">
            <div class="other-project-title">${project.title}</div>
            <div class="other-project-subtitle">${project.subtitle}</div>
        </div>
    `).join('');

    containerEl.innerHTML = html;
}

// Slide 8: 個人プロジェクト
function renderPersonalProjects(projects) {
    const containerEl = document.getElementById('personal-projects');
    if (!containerEl) return;

    const html = projects.map(project => `
        <div class="other-project-card">
            <img src="${project.images[0]}" alt="${project.title}" class="other-project-image">
            <div class="other-project-title">${project.title}</div>
            <div class="other-project-subtitle">${project.subtitle}</div>
        </div>
    `).join('');

    containerEl.innerHTML = html;
}

// Slide 9: スキル・技術
function renderSkills(techStack) {
    const gridEl = document.getElementById('skills-grid');
    if (!gridEl) return;

    const categories = [
        { key: 'hardware', title: 'Hardware' },
        { key: 'software', title: 'Software' },
        { key: 'fabrication', title: 'Digital Fabrication' },
        { key: 'ai', title: 'AI & ML' },
        { key: 'certifications', title: 'Certifications' }
    ];

    const html = categories.map(category => `
        <div class="skill-category">
            <div class="skill-category-title">${category.title}</div>
            <div class="skill-list">
                ${techStack[category.key].map(skill => `<span class="skill-item">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');

    gridEl.innerHTML = html;
}

// ===========================
// Initialize
// ===========================
async function init() {
    const data = await loadData();
    if (!data) {
        console.error('Failed to load data');
        return;
    }

    const { profileData, projectsData } = data;

    // Render Slide 1: 基本情報
    renderBasicInfo(profileData.basicInfo);

    // Render Slide 2: 個人情報・趣味
    renderPersonalInfo(profileData.basicInfo);
    renderHobbies(profileData.hobbies);

    // Render Slide 3: 経歴
    renderCareer(profileData.career);

    // Render Slide 4-6: メインプロジェクト
    renderMainProject(projectsData.pago, 'project-pago');
    renderMainProject(projectsData['hyke-575'], 'project-hyke');
    renderMainProject(projectsData.remix, 'project-remix');

    // Render Slide 7: その他プロジェクト (テクニカルディレクション)
    const otherProjects = Object.values(projectsData)
        .filter(p => p.category === 'テクニカルディレクション');
    renderOtherProjects(otherProjects);

    // Render Slide 8: 個人プロジェクト
    const personalProjects = [
        projectsData.trendgpt,
        projectsData.chameleon,
        projectsData['e-otomo']
    ].filter(p => p); // undefined を除外
    renderPersonalProjects(personalProjects);

    // Render Slide 9: スキル
    renderSkills(profileData.techStack);

    // Initialize Swiper after content is loaded
    initSwiper();
}

// ===========================
// Swiper Initialization
// ===========================
function initSwiper() {
    const swiper = new Swiper('.profile-swiper', {
        direction: 'vertical',
        mousewheel: {
            enabled: true,
            sensitivity: 1,
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        speed: 800,
        effect: 'slide',
        lazy: {
            loadPrevNext: true,
        },
        on: {
            slideChange: function () {
                // Scroll indicatorを最初のスライド以外で非表示
                const scrollIndicator = document.querySelector('.scroll-indicator');
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = this.activeIndex === 0 ? '1' : '0';
                }
            }
        }
    });
}

// ===========================
// Run on DOM Content Loaded
// ===========================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
