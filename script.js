/**
 * Data Visualization Gallery
 * Dynamic gallery system with lightbox functionality
 */

(function() {
    'use strict';

    // Gallery configuration
    const config = {
        svgPath: 'svgs/',
        animationDelay: 50,
        transitionDuration: 250
    };

    // Visualization data with metadata
    const visualizations = [
        {
            filename: 'boxplot.svg',
            title: 'Box Plot',
            category: 'distribution',
            description: 'Statistical distribution visualization showing median, quartiles, and outliers across experimental conditions. Essential for comparing gene expression levels between different sample groups.'
        },
        {
            filename: 'violin_plot.svg',
            title: 'Violin Plot',
            category: 'distribution',
            description: 'Combines box plot statistics with kernel density estimation to show the full distribution shape. Particularly useful for visualizing expression patterns in single-cell RNA-seq data.'
        },
        {
            filename: 'dotplot.svg',
            title: 'Dot Plot',
            category: 'expression',
            description: 'Multi-dimensional visualization displaying gene expression levels across different cell types or conditions using size and color encoding for dual-metric representation.'
        },
        {
            filename: 'single_dotplot.svg',
            title: 'Single Dot Plot',
            category: 'expression',
            description: 'Focused dot plot visualization for comparing expression patterns of selected genes across specific cell populations or experimental timepoints.'
        },
        {
            filename: 'scatterplot.svg',
            title: 'Scatter Plot',
            category: 'expression',
            description: 'Two-dimensional representation of gene expression relationships, often used for correlation analysis and quality control in RNA-seq experiments.'
        },
        {
            filename: 'lineplot.svg',
            title: 'Line Plot',
            category: 'expression',
            description: 'Time-series visualization tracking gene expression changes across multiple timepoints or developmental stages, ideal for temporal analysis.'
        },
        {
            filename: 'response_plot.svg',
            title: 'Response Plot',
            category: 'expression',
            description: 'Dose-response or treatment-response curves showing biological system reactions to varying stimuli concentrations or treatment conditions.'
        },
        {
            filename: 'maplot.svg',
            title: 'MA Plot',
            category: 'expression',
            description: 'Log-ratio (M) versus mean expression (A) plot for differential expression analysis. Highlights significantly regulated genes with fold-change thresholds.'
        },
        {
            filename: 'umap_plot.svg',
            title: 'UMAP Plot',
            category: 'dimensional',
            description: 'Uniform Manifold Approximation and Projection for dimensionality reduction. Reveals cell clusters and developmental trajectories in single-cell transcriptomics data.'
        },
        {
            filename: 'circos_plot.svg',
            title: 'Circos Plot',
            category: 'genomic',
            description: 'Circular visualization of genomic data showing chromosomal interactions, structural variants, and multi-omics relationships in a compact, publication-ready format.'
        }
    ];

    // State management
    let state = {
        currentFilter: 'all',
        currentLightboxIndex: -1,
        filteredItems: []
    };

    // DOM elements cache
    const elements = {
        gallery: null,
        lightbox: null,
        lightboxImage: null,
        lightboxTitle: null,
        lightboxDescription: null,
        filterTabs: null
    };

    /**
     * Initialize the gallery application
     */
    function init() {
        cacheElements();
        renderGallery();
        attachEventListeners();
        animateGalleryItems();
    }

    /**
     * Cache DOM elements for better performance
     */
    function cacheElements() {
        elements.gallery = document.getElementById('gallery');
        elements.lightbox = document.getElementById('lightbox');
        elements.lightboxImage = document.getElementById('lightbox-image');
        elements.lightboxTitle = document.getElementById('lightbox-title');
        elements.lightboxDescription = document.getElementById('lightbox-description');
        elements.filterTabs = document.querySelectorAll('.filter-tab');
    }

    /**
     * Format filename to readable title
     */
    function formatTitle(filename) {
        return filename
            .replace('.svg', '')
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Get category display name
     */
    function getCategoryName(category) {
        const categoryNames = {
            'distribution': 'Statistical Distribution',
            'expression': 'Gene Expression',
            'dimensional': 'Dimensionality Reduction',
            'genomic': 'Genomic Visualization'
        };
        return categoryNames[category] || 'Analysis';
    }

    /**
     * Create gallery item HTML
     */
    function createGalleryItem(viz, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.category = viz.category;
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="gallery-item-image">
                <img src="${config.svgPath}${viz.filename}" 
                     alt="${viz.title}" 
                     loading="lazy">
            </div>
            <div class="gallery-item-info">
                <h3 class="gallery-item-title">${viz.title}</h3>
                <p class="gallery-item-category">${getCategoryName(viz.category)}</p>
            </div>
        `;
        
        // Add click handler
        item.addEventListener('click', () => openLightbox(index));
        
        return item;
    }

    /**
     * Render the gallery
     */
    function renderGallery() {
        if (!elements.gallery) return;
        
        // Clear existing content
        elements.gallery.innerHTML = '';
        
        // Create and append gallery items
        visualizations.forEach((viz, index) => {
            const item = createGalleryItem(viz, index);
            elements.gallery.appendChild(item);
        });
        
        // Update filtered items
        updateFilteredItems();
    }

    /**
     * Animate gallery items on load
     */
    function animateGalleryItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * config.animationDelay}ms`;
        });
    }

    /**
     * Filter gallery items
     */
    function filterGallery(category) {
        state.currentFilter = category;
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.classList.remove('hidden');
                item.style.animation = 'itemFadeIn 0.5s ease-out forwards';
            } else {
                item.classList.add('hidden');
            }
        });
        
        updateFilteredItems();
    }

    /**
     * Update filtered items list
     */
    function updateFilteredItems() {
        if (state.currentFilter === 'all') {
            state.filteredItems = [...Array(visualizations.length).keys()];
        } else {
            state.filteredItems = visualizations
                .map((viz, index) => viz.category === state.currentFilter ? index : null)
                .filter(index => index !== null);
        }
    }

    /**
     * Open lightbox
     */
    function openLightbox(index) {
        state.currentLightboxIndex = index;
        const viz = visualizations[index];
        
        // Update lightbox content
        elements.lightboxImage.src = `${config.svgPath}${viz.filename}`;
        elements.lightboxImage.alt = viz.title;
        elements.lightboxTitle.textContent = viz.title;
        elements.lightboxDescription.textContent = viz.description;
        
        // Show lightbox
        elements.lightbox.classList.add('active');
        elements.lightbox.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        elements.lightbox.classList.remove('active');
        elements.lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        state.currentLightboxIndex = -1;
    }

    /**
     * Navigate lightbox
     */
    function navigateLightbox(direction) {
        const currentPos = state.filteredItems.indexOf(state.currentLightboxIndex);
        let newPos;
        
        if (direction === 'next') {
            newPos = (currentPos + 1) % state.filteredItems.length;
        } else {
            newPos = currentPos - 1;
            if (newPos < 0) newPos = state.filteredItems.length - 1;
        }
        
        openLightbox(state.filteredItems[newPos]);
    }

    /**
     * Attach event listeners
     */
    function attachEventListeners() {
        // Filter tabs
        elements.filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active state
                elements.filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery
                filterGallery(this.dataset.filter);
            });
        });
        
        // Lightbox close button
        const closeBtn = document.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        // Lightbox overlay click
        const overlay = document.querySelector('.lightbox-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeLightbox);
        }
        
        // Lightbox navigation
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => navigateLightbox('prev'));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => navigateLightbox('next'));
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboard(e) {
        if (!elements.lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                navigateLightbox('next');
                break;
        }
    }

    /**
     * Handle image loading errors
     */
    function handleImageError() {
        const images = document.querySelectorAll('.gallery-item-image img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    font-size: 14px;
                `;
                placeholder.textContent = 'Visualization Preview';
                this.parentElement.appendChild(placeholder);
            });
        });
    }

    /**
     * Lazy load images
     */
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img.lazy');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API (if needed for testing or extensions)
    window.gallery = {
        filter: filterGallery,
        openLightbox: openLightbox,
        closeLightbox: closeLightbox
    };

})();