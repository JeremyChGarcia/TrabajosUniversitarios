// Portfolio Website JavaScript
class PortfolioManager {
    constructor() {
        this.projects = this.loadProjects();
        this.currentFilter = 'all';
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.renderProjects();
        this.setupEventListeners();
        this.loadSampleData();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        menuToggle?.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput?.addEventListener('input', (e) => {
            this.searchProjects(e.target.value);
        });

        // Add project form
        const addProjectForm = document.getElementById('addProjectForm');
        addProjectForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProject();
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                // Close mobile menu if open
                mobileMenu?.classList.add('hidden');
            });
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('fixed')) {
                this.closeAllModals();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }
        });
    }

    loadSampleData() {
        // Load sample projects if no projects exist
        if (this.projects.length === 0) {
            const sampleProjects = [
                {
                    id: this.generateId(),
                    title: "Sitio Web Corporativo",
                    description: "Desarrollo completo de sitio web para empresa, incluyendo diseño responsivo y sistema de gestión de contenidos.",
                    category: "web",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
                    url: "https://ejemplo-corporativo.com",
                    tags: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
                    date: new Date().toISOString()
                },
                 {
                    id: this.generateId(),
                    title: "App Móvil de Tareas",
                    description: "Aplicación móvil para gestión de tareas con sincronización en la nube y notificaciones push.",
                    category: "mobile",
                    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
                    url: "https://play.google.com/store/apps/details?id=com.ejemplo.tareas",
                    tags: ["React Native", "Firebase", "Redux", "Push Notifications"],
                    date: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: this.generateId(),
                    title: "App Móvil de Tareas",
                    description: "Aplicación móvil para gestión de tareas con sincronización en la nube y notificaciones push.",
                    category: "mobile",
                    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
                    url: "https://play.google.com/store/apps/details?id=com.ejemplo.tareas",
                    tags: ["React Native", "Firebase", "Redux", "Push Notifications"],
                    date: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: this.generateId(),
                    title: "Identidad Visual",
                    description: "Diseño completo de identidad visual para startup tecnológica, incluyendo logo, paleta de colores y guía de marca.",
                    category: "design",
                    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
                    url: "",
                    tags: ["Adobe Illustrator", "Branding", "Logo Design", "Color Theory"],
                    date: new Date(Date.now() - 172800000).toISOString()
                }
            ];

            sampleProjects.forEach(project => {
                this.projects.push(project);
            });
            this.saveProjects();
            this.renderProjects();
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    loadProjects() {
        try {
            const saved = localStorage.getItem('portfolio_projects');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    }

    saveProjects() {
        try {
            localStorage.setItem('portfolio_projects', JSON.stringify(this.projects));
        } catch (error) {
            console.error('Error saving projects:', error);
        }
    }

    addProject() {
        const form = document.getElementById('addProjectForm');
        const formData = new FormData(form);
        
        const project = {
            id: this.currentEditingId || this.generateId(),
            title: document.getElementById('projectTitle').value.trim(),
            description: document.getElementById('projectDescription').value.trim(),
            category: document.getElementById('projectCategory').value,
            image: document.getElementById('projectImage').value.trim() || this.getDefaultImage(document.getElementById('projectCategory').value),
            url: document.getElementById('projectUrl').value.trim(),
            tags: document.getElementById('projectTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            date: new Date().toISOString()
        };

        if (this.currentEditingId) {
            // Update existing project
            const index = this.projects.findIndex(p => p.id === this.currentEditingId);
            if (index !== -1) {
                this.projects[index] = { ...this.projects[index], ...project };
            }
            this.currentEditingId = null;
        } else {
            // Add new project
            this.projects.unshift(project);
        }

        this.saveProjects();
        this.renderProjects();
        this.closeAddProjectModal();
        
        // Show success message
        this.showNotification('Proyecto guardado exitosamente', 'success');
    }

    editProject() {
        const projectId = document.getElementById('viewProjectModal').dataset.projectId;
        const project = this.projects.find(p => p.id === projectId);
        
        if (project) {
            this.currentEditingId = project.id;
            
            // Populate form with project data
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectCategory').value = project.category;
            document.getElementById('projectImage').value = project.image;
            document.getElementById('projectUrl').value = project.url || '';
            document.getElementById('projectTags').value = project.tags.join(', ');
            
            this.closeViewProjectModal();
            this.openAddProjectModal();
        }
    }

    deleteProject() {
        const projectId = document.getElementById('viewProjectModal').dataset.projectId;
        
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.saveProjects();
            this.renderProjects();
            this.closeViewProjectModal();
            this.showNotification('Proyecto eliminado', 'success');
        }
    }

    getDefaultImage(category) {
        const defaultImages = {
            web: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop',
            mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
            design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
            other: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
        };
        return defaultImages[category] || defaultImages.other;
    }

    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        const emptyState = document.getElementById('emptyState');
        const noResults = document.getElementById('noResults');
        
        if (!grid) return;

        const filteredProjects = this.getFilteredProjects();
        
        if (this.projects.length === 0) {
            grid.innerHTML = '';
            emptyState?.classList.remove('hidden');
            noResults?.classList.add('hidden');
            return;
        }
        
        if (filteredProjects.length === 0) {
            grid.innerHTML = '';
            emptyState?.classList.add('hidden');
            noResults?.classList.remove('hidden');
            return;
        }

        emptyState?.classList.add('hidden');
        noResults?.classList.add('hidden');

        grid.innerHTML = filteredProjects.map(project => this.createProjectCard(project)).join('');
    }

    createProjectCard(project) {
        const categoryColors = {
            web: 'bg-blue-100 text-blue-800',
            mobile: 'bg-green-100 text-green-800',
            design: 'bg-purple-100 text-purple-800',
            other: 'bg-gray-100 text-gray-800'
        };

        const categoryNames = {
            web: 'Web',
            mobile: 'Móvil',
            design: 'Diseño',
            other: 'Otros'
        };

        return `
            <div class="bg-white rounded-lg shadow-md card-hover animate-fade-in overflow-hidden">
                <div class="relative">
                    <img 
                        src="${project.image}" 
                        alt="${project.title}"
                        class="w-full h-48 object-cover"
                        onerror="this.src='https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'"
                    >
                    <div class="absolute top-4 left-4">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[project.category] || categoryColors.other}">
                            ${categoryNames[project.category] || 'Otros'}
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${project.title}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">${project.description}</p>
                    
                    ${project.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-1 mb-4">
                            ${project.tags.slice(0, 3).map(tag => `
                                <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">${tag}</span>
                            `).join('')}
                            ${project.tags.length > 3 ? `<span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">+${project.tags.length - 3}</span>` : ''}
                        </div>
                    ` : ''}
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">
                            ${new Date(project.date).toLocaleDateString('es-ES')}
                        </span>
                        <div class="flex gap-2">
                            ${project.url ? `
                                <a href="${project.url}" target="_blank" class="text-primary hover:text-secondary transition duration-300" title="Ver proyecto">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                            ` : ''}
                            <button onclick="portfolio.viewProject('${project.id}')" class="text-primary hover:text-secondary transition duration-300" title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    viewProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('viewProjectModal');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');

        modal.dataset.projectId = projectId;
        title.textContent = project.title;

        const categoryNames = {
            web: 'Desarrollo Web',
            mobile: 'Aplicación Móvil',
            design: 'Diseño',
            other: 'Otros'
        };

        content.innerHTML = `
            <div class="mb-6">
                <img 
                    src="${project.image}" 
                    alt="${project.title}"
                    class="w-full h-64 object-cover rounded-lg"
                    onerror="this.src='https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'"
                >
            </div>
            
            <div class="mb-4">
                <span class="px-3 py-1 text-sm font-semibold bg-primary text-white rounded-full">
                    ${categoryNames[project.category] || 'Otros'}
                </span>
            </div>
            
            <p class="text-gray-700 mb-6 leading-relaxed">${project.description}</p>
            
            ${project.tags.length > 0 ? `
                <div class="mb-6">
                    <h4 class="font-semibold text-gray-800 mb-2">Tecnologías utilizadas:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${project.tags.map(tag => `
                            <span class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-500">
                    <i class="fas fa-calendar mr-1"></i>
                    Creado: ${new Date(project.date).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
                ${project.url ? `
                    <a href="${project.url}" target="_blank" class="text-primary hover:text-secondary text-sm font-medium">
                        <i class="fas fa-external-link-alt mr-1"></i>
                        Ver proyecto en vivo
                    </a>
                ` : ''}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    getFilteredProjects() {
        let filtered = this.projects;

        // Filter by category
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(project => project.category === this.currentFilter);
        }

        // Filter by search term
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        if (searchTerm) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        return filtered;
    }

    filterProjects(category) {
        this.currentFilter = category;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        
        event.target.classList.remove('bg-gray-200', 'text-gray-700');
        event.target.classList.add('bg-primary', 'text-white');
        
        this.renderProjects();
    }

    searchProjects(term) {
        this.renderProjects();
    }

    openAddProjectModal() {
        document.getElementById('addProjectModal').classList.remove('hidden');
        document.getElementById('projectTitle').focus();
    }

    closeAddProjectModal() {
        document.getElementById('addProjectModal').classList.add('hidden');
        document.getElementById('addProjectForm').reset();
        this.currentEditingId = null;
    }

    closeViewProjectModal() {
        document.getElementById('viewProjectModal').classList.add('hidden');
    }

    closeAllModals() {
        this.closeAddProjectModal();
        this.closeViewProjectModal();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
        } else {
            notification.classList.add('bg-blue-500', 'text-white');
        }
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    exportProjects() {
        const dataStr = JSON.stringify(this.projects, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'mis-proyectos.json';
        link.click();
    }

    importProjects(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedProjects = JSON.parse(e.target.result);
                if (Array.isArray(importedProjects)) {
                    this.projects = importedProjects;
                    this.saveProjects();
                    this.renderProjects();
                    this.showNotification('Proyectos importados exitosamente', 'success');
                }
            } catch (error) {
                this.showNotification('Error al importar proyectos', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Global functions for HTML onclick handlers
function filterProjects(category) {
    portfolio.filterProjects(category);
}

function openAddProjectModal() {
    portfolio.openAddProjectModal();
}

function closeAddProjectModal() {
    portfolio.closeAddProjectModal();
}

function closeViewProjectModal() {
    portfolio.closeViewProjectModal();
}

function editProject() {
    portfolio.editProject();
}

function deleteProject() {
    portfolio.deleteProject();
}

// Initialize the portfolio when DOM is loaded
let portfolio;
document.addEventListener('DOMContentLoaded', () => {
    portfolio = new PortfolioManager();
});

// Additional utility functions
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N to add new project
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openAddProjectModal();
    }
});

// Add CSS for line clamping
const style = document.createElement('style');
style.textContent = `
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;
document.head.appendChild(style);