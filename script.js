// script.js - ORDA College Website Full Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLoadingScreen();
    initTheme();
    initLanguage();
    initNavigation();
    initStatsCounter();
    initPrograms();
    initGallery();
    initNews();
    initForms();
    initFAQ();
    initChatbot();
    initFloatingButtons();
    initModals();
    initScrollEffects();
    initCurrentYear();
    
    console.log('🎓 ORDA College Website Loaded Successfully!');
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
}

// ===== THEME TOGGLE =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        showNotification(`Тема ауыстырылды: ${newTheme === 'light' ? 'Ашық' : 'Қараңғы'}`);
    });
}

// ===== LANGUAGE SYSTEM =====
function initLanguage() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('language') || 'kk';
    
    // Set initial language
    setLanguage(savedLang);
    
    langButtons.forEach(btn => {
        if (btn.dataset.lang === savedLang) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            
            // Update active button
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            localStorage.setItem('language', lang);
        });
    });
}

async function setLanguage(lang) {
    try {
        const response = await fetch(`translations/${lang}.json`);
        const translations = await response.json();
        
        // Update all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });
        
        showNotification(`Тіл ауыстырылды: ${lang === 'kk' ? 'Қазақша' : lang === 'ru' ? 'Орысша' : 'Ағылшынша'}`);
    } catch (error) {
        console.error('Language loading failed:', error);
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== STATS COUNTER =====
function initStatsCounter() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const speed = 2000; // Duration in milliseconds
                
                animateCounter(counter, target, speed);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== PROGRAMS SYSTEM =====
async function initPrograms() {
    try {
        const response = await fetch('data/programs.json');
        const programs = await response.json();
        
        renderPrograms(programs);
        setupProgramFilter(programs);
        populateProgramSelect(programs);
    } catch (error) {
        console.error('Programs loading failed:', error);
        showNotification('Мамандықтарды жүктеу сәтсіз аяқталды', 'error');
    }
}

function renderPrograms(programs, filter = 'all') {
    const grid = document.getElementById('programsGrid');
    const filtered = filter === 'all' ? programs : programs.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map(program => `
        <div class="program-card" data-category="${program.category}">
            <div class="program-header">
                <div>
                    <h3 class="program-title">${program.title}</h3>
                    <div class="program-code">${program.code}</div>
                </div>
                <span class="program-duration">${program.duration}</span>
            </div>
            <div class="program-body">
                <p class="program-description">${program.description}</p>
                <ul class="program-features">
                    ${program.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="program-footer">
                <button class="btn btn-primary btn-block view-program" data-id="${program.id}">
                    <i class="fas fa-eye"></i> Толығырақ
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-program').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const programId = e.target.closest('.view-program').dataset.id;
            const program = programs.find(p => p.id == programId);
            if (program) {
                openProgramModal(program);
            }
        });
    });
}

function setupProgramFilter(programs) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter programs
            const filter = btn.dataset.filter;
            renderPrograms(programs, filter);
            
            // Scroll to programs section
            document.getElementById('programs').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function populateProgramSelect(programs) {
    const select = document.getElementById('program');
    if (!select) return;
    
    select.innerHTML = `
        <option value="" selected disabled>Мамандықты таңдаңыз</option>
        ${programs.map(program => `
            <option value="${program.id}">${program.code} - ${program.title}</option>
        `).join('')}
    `;
}

function openProgramModal(program) {
    const modalContent = document.getElementById('programModalContent');
    
    modalContent.innerHTML = `
        <div class="program-modal">
            <div class="modal-header" style="background: var(--gradient-primary); padding: 2rem; color: white; border-radius: 12px 12px 0 0;">
                <h2>${program.title}</h2>
                <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                    <span class="badge">${program.code}</span>
                    <span class="badge">${program.duration}</span>
                    <span class="badge">${program.category}</span>
                </div>
            </div>
            <div class="modal-body" style="padding: 2rem;">
                <div class="row" style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                    <div>
                        <h3>Сипаттама</h3>
                        <p>${program.description}</p>
                        
                        <h3 style="margin-top: 2rem;">Оқыту бағдарламасы</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${program.curriculum?.map(item => `
                                <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                                    <i class="fas fa-book" style="color: var(--secondary-color); margin-right: 0.5rem;"></i>
                                    ${item}
                                </li>
                            `).join('') || ''}
                        </ul>
                        
                        <h3 style="margin-top: 2rem;">Карьера мүмкіндіктері</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                            ${program.careers?.map(career => `
                                <span style="background: var(--gray-100); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem;">
                                    ${career}
                                </span>
                            `).join('') || ''}
                        </div>
                    </div>
                    
                    <div>
                        <div class="info-card" style="background: var(--gray-100); padding: 1.5rem; border-radius: 12px;">
                            <h4>Негізгі ақпарат</h4>
                            <div style="margin-top: 1rem;">
                                <p><strong>Оқу мерзімі:</strong> ${program.duration}</p>
                                <p><strong>Түрі:</strong> ${program.type || 'Күндізгі'}</p>
                                <p><strong>Тілі:</strong> ${program.language || 'Қазақ/орыс'}</p>
                                <p><strong>Бағасы:</strong> ${program.price || 'Ақылы/грант'}</p>
                            </div>
                            
                            <button class="btn btn-primary btn-block" style="margin-top: 1.5rem;" onclick="applyForProgram('${program.id}')">
                                <i class="fas fa-paper-plane"></i> Осы мамандыққа өтініш беру
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('programModal').classList.add('active');
}

// ===== GALLERY =====
function initGallery() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== NEWS SYSTEM =====
async function initNews() {
    try {
        const response = await fetch('data/news.json');
        const news = await response.json();
        
        renderNews(news);
    } catch (error) {
        console.error('News loading failed:', error);
    }
}

function renderNews(news) {
    const grid = document.getElementById('newsGrid');
    
    grid.innerHTML = news.slice(0, 3).map(item => `
        <div class="news-card">
            <div class="news-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="news-content">
                <div class="news-date">
                    <i class="far fa-calendar"></i>
                    ${item.date}
                </div>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-excerpt">${item.excerpt}</p>
                <a href="news.html?id=${item.id}" class="btn btn-outline">
                    <i class="fas fa-arrow-right"></i> Оқу
                </a>
            </div>
        </div>
    `).join('');
}

// ===== FORMS HANDLING =====
function initForms() {
    // Consultation Form
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleConsultationForm(consultationForm);
        });
    }
    
    // Application Form
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleApplicationForm(applicationForm);
        });
    }
    
    // Newsletter Form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleNewsletterForm(form);
        });
    });
}

function handleConsultationForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Save to localStorage
    let consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    consultations.push({
        ...data,
        date: new Date().toISOString(),
        status: 'new'
    });
    localStorage.setItem('consultations', JSON.stringify(consultations));
    
    // Show success message
    showNotification('Сіздің сұрауыңыз қабылданды! Біз сізбен жақын арада хабарласамыз.', 'success');
    
    // Reset form
    form.reset();
}

function handleApplicationForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate
    if (!data.fullName || !data.phone || !data.program) {
        showNotification('Барлық міндетті өрістерді толтырыңыз', 'error');
        return;
    }
    
    // Save to localStorage
    let applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications.push({
        ...data,
        id: generateId(),
        date: new Date().toISOString(),
        status: 'new'
    });
    localStorage.setItem('applications', JSON.stringify(applications));
    
    // Show success modal
    document.getElementById('successModal').classList.add('active');
    
    // Reset form
    form.reset();
    
    // Send to server (in real implementation)
    sendApplicationToServer(data);
}

function handleNewsletterForm(form) {
    const email = form.querySelector('input[type="email"]').value;
    
    if (!validateEmail(email)) {
        showNotification('Электрондық поштаны дұрыс енгізіңіз', 'error');
        return;
    }
    
    // Save to localStorage
    let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }
    
    showNotification('Жазылу сәтті аяқталды!', 'success');
    form.reset();
}

function sendApplicationToServer(data) {
    // This would be your actual API call
    console.log('Sending application to server:', data);
    
    // Simulate API call
    setTimeout(() => {
        console.log('Application sent successfully');
    }, 1000);
}

// ===== FAQ SYSTEM =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===== CHATBOT SYSTEM =====
function initChatbot() {
    const chatBtn = document.getElementById('chatBtn');
    const chatClose = document.getElementById('chatClose');
    const chatWidget = document.getElementById('chatWidget');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    
    // Toggle chat
    chatBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('active');
    });
    
    chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Get bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Define responses
        const responses = {
            greeting: [
                "Сәлеметсіз бе! 👋 Мен ORDA колледжінің виртуалды көмекшісімін. Сізге қалай көмектесе аламын?",
                "Сәлем! ORDA колледжінің ботымын. Сұрақтарыңыз бар ма?"
            ],
            programs: "Бізде 38-ден астам мамандық бар: IT технологиялары, бизнес, білім беру, шығармашылық өнер, құқық, инженерлік іс. Толық тізімді 'Мамандықтар' бөлімінде көре аласыз.",
            admission: "Қабылдау 20 маусымнан 25 тамызға дейін жүреді. Қажетті құжаттар: өтініш, білімі туралы куәлік, денсаулық туралы анықтама (086-У), туу туралы куәлік, 6 фото 3x4, жеке куәлық.",
            grants: "Иә, мемлекеттік гранттар бар. Гранттар шектеулі санда беріледі, сондықтан ертерек өтініш беру ұсынылады.",
            hostel: "Иә, колледж студенттері үшін жатақхана бар. Айына 15.000 теңге. Орын саны шектеулі.",
            contact: "Бізбен байланысу үшін: 📞 +7 (7242) 27-75-27 📧 info@ordacollege.kz 📍 Қызылорда, Қонаев көш., 17",
            default: "Кешіріңіз, мен сіздің сұрағыңызды түсінбеймін. Басқа сұрақтарыңыз бар ма? Негізгі тақырыптар: мамандықтар, қабылдау, гранттар, байланыс."
        };
        
        // Check keywords
        if (lowerMessage.includes('салем') || lowerMessage.includes('сәлем') || lowerMessage.includes('привет') || lowerMessage.includes('hello')) {
            return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
        } else if (lowerMessage.includes('мамандық') || lowerMessage.includes('специальность') || lowerMessage.includes('program')) {
            return responses.programs;
        } else if (lowerMessage.includes('қабылдау') || lowerMessage.includes('прием') || lowerMessage.includes('admission')) {
            return responses.admission;
        } else if (lowerMessage.includes('грант') || lowerMessage.includes('стипендия') || lowerMessage.includes('grant')) {
            return responses.grants;
        } else if (lowerMessage.includes('жатақхана') || lowerMessage.includes('общежит') || lowerMessage.includes('hostel')) {
            return responses.hostel;
        } else if (lowerMessage.includes('байланыс') || lowerMessage.includes('контакт') || lowerMessage.includes('contact')) {
            return responses.contact;
        } else {
            return responses.default;
        }
    }
}

// ===== FLOATING BUTTONS =====
function initFloatingButtons() {
    const backToTop = document.getElementById('backToTop');
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Back to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Phone button
    document.querySelector('.phone-btn').addEventListener('click', () => {
        window.location.href = 'tel:+77242277527';
    });
}

// ===== MODALS =====
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close, #successClose');
    
    // Close modal on button click
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });
    
    // Close modal on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ===== CURRENT YEAR =====
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== HELPER FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27AE60' : type === 'error' ? '#E74C3C' : '#3498DB'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 4s forwards;
        max-width: 400px;
    `;
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+7\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    return re.test(phone);
}

// ===== GLOBAL FUNCTIONS =====
function applyForProgram(programId) {
    // Close program modal
    document.getElementById('programModal').classList.remove('active');
    
    // Scroll to application form
    document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
    
    // Set program in form
    const programSelect = document.getElementById('program');
    if (programSelect) {
        programSelect.value = programId;
    }
    
    showNotification('Мамандық таңдалды. Өтініш формасына өтіңіз.', 'info');
}

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registered:', registration);
        }).catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// ===== OFFLINE DETECTION =====
window.addEventListener('online', () => {
    showNotification('Интернет қосылды', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Интернет қосылмаған. Кейбір функциялар шектеулі болады.', 'warning');
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                    window.performance.timing.navigationStart;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('Page load time is too high!');
    }
});