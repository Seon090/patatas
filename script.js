// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Navigation Sections Toggle
const navSectionTitles = document.querySelectorAll('.nav-section-title');

navSectionTitles.forEach(title => {
    title.addEventListener('click', () => {
        const navItems = title.nextElementSibling;
        const isActive = title.classList.contains('active');
        
        // Close all sections
        navSectionTitles.forEach(t => {
            t.classList.remove('active');
            t.nextElementSibling.classList.remove('active');
        });
        
        // Open clicked section if it wasn't active
        if (!isActive) {
            title.classList.add('active');
            navItems.classList.add('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after clicking
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Copy Code Button Functionality
const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const codeBlock = button.closest('.code-block');
        const codeElement = codeBlock.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            
            // Visual feedback
            const originalText = button.textContent;
            button.textContent = 'Copiado!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    });
});

// Generate Table of Contents
function generateTOC() {
    const content = document.querySelector('.content');
    const tocNav = document.querySelector('.toc-nav');
    
    if (!content || !tocNav) return;
    
    const headings = content.querySelectorAll('h2, h3');
    
    headings.forEach(heading => {
        const link = document.createElement('a');
        link.href = `#${heading.parentElement.id}`;
        link.textContent = heading.textContent;
        link.style.paddingLeft = heading.tagName === 'H3' ? '24px' : '12px';
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        tocNav.appendChild(link);
    });
}

// Highlight Active Section in TOC
function highlightActiveTOC() {
    const tocLinks = document.querySelectorAll('.toc-nav a');
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Search Functionality
const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allNavLinks = document.querySelectorAll('.nav-link');
        
        allNavLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            const listItem = link.parentElement;
            
            if (text.includes(searchTerm)) {
                listItem.style.display = 'block';
            } else {
                listItem.style.display = 'none';
            }
        });
        
        // If searching, expand all sections
        if (searchTerm) {
            navSectionTitles.forEach(title => {
                title.classList.add('active');
                title.nextElementSibling.classList.add('active');
            });
        }
    });
    
    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateTOC();
    highlightActiveTOC();
    
    // Open first section by default
    if (navSectionTitles.length > 0) {
        navSectionTitles[0].classList.add('active');
        navSectionTitles[0].nextElementSibling.classList.add('active');
    }
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});