// --- CONSTELATION BACKGROUND LOGIC ---
const canvas = document.getElementById('constellation-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;
const LINE_DISTANCE = 120; 
const MOUSE_DISTANCE = 200; 
const ACCENT_COLOR = '0, 188, 212'; 

let mouse = { x: null, y: null };

window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

function handleResize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', handleResize);
handleResize(); 

class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        // Slower base velocity for a calmer 'star field'
        this.velocity = { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005 };
        this.baseColor = 'rgba(255, 255, 255, 0.8)'; 
     }
    draw() {
        ctx.fillStyle = this.baseColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        // Base movement logic
        this.x += this.velocity.x; this.y += this.velocity.y;
        if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
        this.baseColor = 'rgba(255, 255, 255, 0.8)';
        
        // Mouse interaction for subtle, slow movement
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x; const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < MOUSE_DISTANCE) {
                const pushForce = 0.005; 
                
                const forceX = dx / distance * pushForce;
                const forceY = dy / distance * pushForce;
                
                // Gently repel particle from the mouse position
                this.velocity.x -= forceX * 0.5; 
                this.velocity.y -= forceY * 0.5; 
                
                // Draw connection line (visual hover effect)
                ctx.beginPath();
                const opacity = 1 - (distance / MOUSE_DISTANCE);
                ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${opacity * 0.8})`; 
                ctx.lineWidth = 1.5;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                
                this.baseColor = `rgba(255, 255, 255, ${0.8 + 0.2 * opacity})`;
            }
        }
        this.draw();
    }
}
function init() {
    particles = []; 
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        particles.push(new Particle(x, y, radius));
    }
}
function connect() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x; const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < LINE_DISTANCE) {
                const opacityValue = 1 - (distance / LINE_DISTANCE);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    connect(); 
    for (let i = 0; i < particles.length; i++) { particles[i].update(); }
}
init();
animate();

// --- CAROUSEL AND MODAL LOGIC (PROJECTS ONLY) ---

function setupProjectCarousel(trackSelector, prevButtonSelector, nextButtonSelector) {
    const track = document.getElementById(trackSelector);
    const prevButton = document.querySelector(prevButtonSelector);
    const nextButton = document.querySelector(nextButtonSelector);

    if (track && prevButton && nextButton) {
        window.addEventListener('load', () => {
            const firstCard = track.querySelector('.project-card');
            
            if (firstCard) {
                const CARD_WIDTH = firstCard.offsetWidth;
                const GAP_WIDTH = 30; 
                const SCROLL_STEP = CARD_WIDTH + GAP_WIDTH; 

                prevButton.addEventListener('click', () => {
                    if (track.scrollLeft > 0) {
                        track.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
                    }
                });
                
                nextButton.addEventListener('click', () => {
                    if (track.scrollLeft < (track.scrollWidth - track.clientWidth)) {
                        track.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
                    }
                });
            }
        });
    }
}

setupProjectCarousel('project-carousel-track', '.prev-button', '.next-button');

const projectCards = document.querySelectorAll('.project-card');
const modalOverlay = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = document.getElementById('modal-close-btn');

const projectDetails = {
    'compound-screening': {
        title: "AI-Powered Natural Compound Screening",
        github: "https://github.com/your-repo-bio", 
        content: `
            <p><strong>Project Type:</strong> Mini Project</p>
            <p>This project involved leveraging **Graph Neural Networks (GNNs)**, **Variational Autoencoders (VAEs)**, and **Generative Adversarial Networks (GANs)** to predict bioactive natural compounds. Key steps included:</p>
            <ul>
                <li>Validated compound efficacy using **docking simulations**.</li>
                <li>Ensured model transparency by integrating **SHAP** for explainability.</li>
                <li>Developed a user-friendly web tool using **Streamlit** for deployment.</li>
            </ul>
        ` 
    },
    'plastic-cycle': {
        title: "PlastiCycle",
        github: "https://github.com/your-repo-plastic", 
        content: `
            <p><strong>Event:</strong> HackXelerate’25</p>
            <p>PlastiCycle is an **AI-powered recycling platform** designed to combat plastic waste. The solution uses mobile image recognition to instantly identify plastic types, guiding users to correct disposal methods. </p>
            <ul>
                <li>**Impact:** Directly addresses **UN SDG 12 (Responsible Consumption)** and **SDG 13 (Climate Action)**.</li>
                <li>Features a reward system and educational content to promote sustained eco-friendly behavior.</li>
            </ul>
        `
    },
    'job-analyzer': {
        title: "AI-powered Job Analyzer & Career System",
        github: "https://github.com/your-repo-job", 
        content: `
            <p><strong>Event:</strong> IBM Hackathon ’25</p>
            <p>Developed an **AI-driven recruitment platform** using **BERT-based NLP and NER** to perform resume screening, compute job-resume matching scores, and provide personalized career guidance based on skill gap analysis.</p>
            <ul>
                <li>**Tech Stack:** BERT, NLP/NER, AI/ML models, Supabase (for authentication) & Python backend.</li>
                <li>Significantly reduces manual screening time and improves match accuracy.</li>
            </ul>
        ` 
    },
    'screen-time': {
        title: "Screen Time Manager",
        github: "https://github.com/your-repo-screentime", 
        content: `
            <p><strong>Event:</strong> VIT National Level Hackathon</p>
            <p>A browser extension focused on promoting healthy digital habits for children. Functions as a robust **parental control** tool.</p>
            <ul>
                <li>Allows parents to set **custom time profiles** for different websites/apps.</li>
                <li>Integrates interactive **quizzes and challenges** to make screen time restrictions engaging and educational.</li>
                <li>**Tech Stack:** Browser Extension APIs, JavaScript/HTML/CSS.</li>
            </ul>
        `
    }
};

function showModal(projectId) {
    const project = projectDetails[projectId];
    if (project) {
        modalTitle.textContent = project.title;
        
        let linksHtml = '<div class="modal-link-group">';
        
        if (project.github) {
            linksHtml += `<a href="${project.github}" target="_blank"><i class="fab fa-github"></i> View Code</a>`;
        }
        
        linksHtml += '</div>';

        modalBody.innerHTML = project.content + linksHtml;
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
}

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project-id');
        showModal(projectId);
    });
});

modalCloseBtn.addEventListener('click', hideModal);

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        hideModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.style.display === 'flex') {
        hideModal();
    }
});

// --- SKILLS SECTION OBSERVER FOR SMOOTH ENTRY ---

const skillBubbles = document.querySelectorAll('.skill-bubble');
const skillSection = document.getElementById('skills');

if (skillSection) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBubbles.forEach(bubble => {
                    const delay = parseInt(bubble.getAttribute('data-delay'));
                    setTimeout(() => {
                        bubble.classList.add('visible');
                    }, delay);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); 

    skillObserver.observe(skillSection);
}

// --- EMAILJS CONTACT FORM LOGIC ---

// IMPORTANT: Replace these placeholders with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_p6bzplc'; 
const EMAILJS_TEMPLATE_ID = 'template_a3dawcr'; 
const EMAILJS_PUBLIC_KEY = 'nMOyiLeQ3qYQRSrds'; 

const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

// Initialize EmailJS with your public key
emailjs.init(EMAILJS_PUBLIC_KEY);

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message visible ${type}`;
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.classList.remove('visible');
    }, 5000);
}

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    formMessage.classList.remove('visible', 'success', 'error');

    const templateParams = {
        from_name: document.getElementById('from_name').value,
        from_email: document.getElementById('from_email').value,
        message: document.getElementById('message').value,
        to_name: 'Angel Iruthya' // Recipient name, static
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            showFormMessage('Message successfully sent! I will be in touch shortly.', 'success');
            contactForm.reset(); // Clear the form fields
        }, (error) => {
            console.error('FAILED...', error);
            showFormMessage('Failed to send the message. Please try again later or email me directly.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        });
});