'use strict';

(function() {
  // Set current year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Gallery data for individual visualizations
  var visualizations = [
    {
      file: "boxplot.svg",
      name: "Box Plot",
      category: "Distribution Analysis",
      description: "Statistical distribution visualization showing median, quartiles, and outliers across multiple experimental groups. Ideal for comparing gene expression levels between conditions."
    },
    {
      file: "violin_plot.svg",
      name: "Violin Plot",
      category: "Distribution Analysis",
      description: "Combines box plot statistics with kernel density estimation to show the full distribution shape. Perfect for visualizing expression patterns in single-cell RNA-seq data."
    },
    {
      file: "dotplot.svg",
      name: "Dot Plot",
      category: "Expression Matrix",
      description: "Multi-dimensional visualization displaying gene expression levels across different cell types or conditions using size and color encoding for dual-metric representation."
    },
    {
      file: "single_dotplot.svg",
      name: "Single Dot Plot",
      category: "Expression Matrix",
      description: "Focused dot plot visualization for comparing expression patterns of selected genes across specific cell populations or experimental timepoints."
    },
    {
      file: "lineplot.svg",
      name: "Line Plot",
      category: "Temporal Analysis",
      description: "Temporal gene expression dynamics across multiple timepoints. Captures expression trajectories during differentiation or treatment response studies."
    },
    {
      file: "response_plot.svg",
      name: "Response Plot",
      category: "Temporal Analysis",
      description: "Dose-response or time-response curves showing biological system reactions to varying stimuli concentrations or temporal exposures."
    },
    {
      file: "scatterplot.svg",
      name: "Scatter Plot",
      category: "Correlation Analysis",
      description: "High-density scatter plot for exploring relationships between continuous variables. Features regression lines and confidence intervals for correlation analysis."
    },
    {
      file: "maplot.svg",
      name: "MA Plot",
      category: "Differential Analysis",
      description: "Log-ratio (M) versus mean expression (A) plot for differential expression analysis. Highlights significantly regulated genes with fold-change thresholds."
    },
    {
      file: "umap_plot.svg",
      name: "UMAP Plot",
      category: "Dimensionality Reduction",
      description: "Uniform Manifold Approximation and Projection visualization revealing cell clusters and trajectories in single-cell transcriptomic datasets."
    },
    {
      file: "circos_plot.svg",
      name: "Circos Plot",
      category: "Genomic Interactions",
      description: "Circular genomic visualization displaying chromosomal rearrangements, copy number variations, and inter-chromosomal interactions from Hi-C or ChIP-seq experiments."
    }
  ];

  // Lightbox functionality
  function createLightbox() {
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = 
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<div class="lightbox-content">' +
        '<img class="lightbox-image" alt="">' +
        '<div class="lightbox-caption">' +
          '<h3></h3>' +
          '<p></p>' +
        '</div>' +
      '</div>';
    
    document.body.appendChild(lightbox);
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
    
    return lightbox;
  }
  
  function openLightbox(imgSrc, title, description) {
    var lightbox = document.querySelector('.lightbox') || createLightbox();
    var img = lightbox.querySelector('.lightbox-image');
    var captionTitle = lightbox.querySelector('.lightbox-caption h3');
    var captionDesc = lightbox.querySelector('.lightbox-caption p');
    
    img.src = imgSrc;
    img.alt = title;
    captionTitle.textContent = title;
    captionDesc.textContent = description;
    
    setTimeout(function() {
      lightbox.classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    var lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Keep gallery section for detailed view (optional)
  function showAllVisualizations() {
    var root = document.getElementById('gallery-root');
    if (!root) return;
    
    root.innerHTML = '';
    
    var section = document.createElement('div');
    section.className = 'gallery-category visible';
    
    var title = document.createElement('h3');
    title.textContent = 'All Visualizations';
    section.appendChild(title);
    
    var grid = document.createElement('div');
    grid.className = 'gallery-grid';
    
    visualizations.forEach(function(viz) {
      var card = document.createElement('div');
      card.className = 'gallery-item';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'View ' + viz.name);
      
      var imageWrapper = document.createElement('div');
      imageWrapper.className = 'gallery-image';
      
      var img = document.createElement('img');
      img.src = 'svgs/' + viz.file;
      img.alt = viz.name;
      img.loading = 'lazy';
      imageWrapper.appendChild(img);
      
      var info = document.createElement('div');
      info.className = 'gallery-info';
      
      var itemTitle = document.createElement('h4');
      itemTitle.textContent = viz.name;
      info.appendChild(itemTitle);
      
      var itemDesc = document.createElement('p');
      itemDesc.textContent = viz.category;
      info.appendChild(itemDesc);
      
      card.appendChild(imageWrapper);
      card.appendChild(info);
      
      card.addEventListener('click', function() {
        openLightbox(img.src, viz.name, viz.description);
      });
      
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img.src, viz.name, viz.description);
        }
      });
      
      grid.appendChild(card);
    });
    
    section.appendChild(grid);
    root.appendChild(section);
  }

  // Create gallery navigation interface
  function createGalleryNavigation() {
    var navGrid = document.getElementById('gallery-nav-grid');
    if (!navGrid) return;
    
    navGrid.innerHTML = '';
    
    visualizations.forEach(function(viz) {
      var navItem = document.createElement('div');
      navItem.className = 'gallery-nav-item';
      navItem.setAttribute('tabindex', '0');
      navItem.setAttribute('role', 'button');
      navItem.setAttribute('aria-label', 'View ' + viz.name + ' visualization');
      
      navItem.innerHTML = 
        '<div class="gallery-nav-preview">' +
          '<img src="svgs/' + viz.file + '" alt="' + viz.name + '" loading="lazy">' +
        '</div>' +
        '<div class="gallery-nav-info">' +
          '<h3 class="gallery-nav-title-text">' + viz.name + '</h3>' +
          '<p class="gallery-nav-subtitle">' + viz.category + '</p>' +
        '</div>' +
        '<div class="gallery-nav-overlay">' +
          '<h3 class="gallery-nav-overlay-title">' + viz.name + '</h3>' +
        '</div>';
      
      // Click handler to open lightbox
      navItem.addEventListener('click', function() {
        openLightbox('svgs/' + viz.file, viz.name, viz.description);
      });
      
      // Keyboard support
      navItem.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox('svgs/' + viz.file, viz.name, viz.description);
        }
      });
      
      navGrid.appendChild(navItem);
    });
  }
  
  // Initialize gallery navigation
  createGalleryNavigation();
  
  // Remove old gallery rendering functions since we're using the new navigation
  // But keep the lightbox functionality

  // Smooth scroll for anchor links
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      var target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
})();