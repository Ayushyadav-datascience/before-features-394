document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      
      // Toggle icon between bars and times
      const icon = mobileMenuBtn.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Theme toggle
  const themeToggleButtons = document.querySelectorAll('.theme-toggle');
  
  themeToggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      
      // Toggle icon between sun and moon
      const icons = document.querySelectorAll('.theme-toggle i');
      icons.forEach(icon => {
        if (icon.classList.contains('fa-sun')) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        } else {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      });
      
      // Save theme preference to localStorage
      const isDarkTheme = document.body.classList.contains('dark-theme');
      localStorage.setItem('darkTheme', isDarkTheme);
    });
  });
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem('darkTheme');
  if (savedTheme === 'true') {
    document.body.classList.add('dark-theme');
    const icons = document.querySelectorAll('.theme-toggle i');
    icons.forEach(icon => {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    });
  }
  
  // Authentication state handling
  function updateAuthUI() {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    
    // Desktop auth buttons
    const signInBtn = document.querySelector('.sign-in-btn');
    const signUpBtn = document.querySelector('.sign-up-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    
    // Mobile auth buttons
    const mobileSignIn = document.querySelector('.mobile-sign-in');
    const mobileSignUp = document.querySelector('.mobile-sign-up');
    const mobileLogout = document.querySelector('.mobile-logout');
    
    if (isLoggedIn) {
      // User is logged in - show logout button, hide login/signup
      if (signInBtn) signInBtn.style.display = 'none';
      if (signUpBtn) signUpBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      
      if (mobileSignIn) mobileSignIn.style.display = 'none';
      if (mobileSignUp) mobileSignUp.style.display = 'none';
      if (mobileLogout) mobileLogout.style.display = 'block';
    } else {
      // User is logged out - show login/signup, hide logout
      if (signInBtn) signInBtn.style.display = 'inline-block';
      if (signUpBtn) signUpBtn.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      
      if (mobileSignIn) mobileSignIn.style.display = 'block';
      if (mobileSignUp) mobileSignUp.style.display = 'block';
      if (mobileLogout) mobileLogout.style.display = 'none';
    }
  }
  
  // Handle logout button click
  const logoutBtns = document.querySelectorAll('.logout-btn, .mobile-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // Clear authentication state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update UI
      updateAuthUI();
      
      // Redirect to home page
      window.location.href = 'index.html';
    });
  });
  
  // Check authentication state on page load
  updateAuthUI();

  // Category filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get category to filter by
      const category = this.dataset.category;
      
      // Filter events by category
      fetchEvents(category);
    });
  });

  // Search functionality
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
      const searchQuery = searchInput.value.trim();
      fetchEvents('all', searchQuery);
    });
    
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        const searchQuery = searchInput.value.trim();
        fetchEvents('all', searchQuery);
      }
    });
  }

  // Fetch events from API
  function fetchEvents(category = 'all', search = '') {
    const eventsGrid = document.querySelector('.events-grid');
    const noEventsMessage = document.getElementById('no-events-message');
    
    if (!eventsGrid) return;

    let apiUrl = '/api/posts';
    const params = new URLSearchParams();
    
    if (category && category !== 'all') {
      params.append('category', category);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (params.toString()) {
      apiUrl += '?' + params.toString();
    }

    // Show loading state
    eventsGrid.innerHTML = '<p>Loading events...</p>';
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          eventsGrid.innerHTML = '';
          if (noEventsMessage) {
            noEventsMessage.style.display = 'block';
          } else {
            eventsGrid.innerHTML = '<p>No events found.</p>';
          }
          return;
        }

        if (noEventsMessage) {
          noEventsMessage.style.display = 'none';
        }

        let eventsHTML = '';
        data.forEach(event => {
          eventsHTML += `
            <div class="event-card">
              <div class="event-image">
                <i class="fas fa-calendar-days"></i>
                <span class="event-category">${event.category || 'General'}</span>
              </div>
              <div class="event-content">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-details">
                  <div class="detail">
                    <i class="fas fa-calendar-days"></i>
                    <span>${new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div class="detail">
                    <i class="fas fa-clock"></i>
                    <span>${event.time || 'TBD'}</span>
                  </div>
                  <div class="detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location || 'TBD'}</span>
                  </div>
                  <div class="detail">
                    <i class="fas fa-users"></i>
                    <span>${event.attendees ? event.attendees.length : 0} attending</span>
                  </div>
                </div>
              </div>
              <div class="event-actions">
                <a href="event-details.html?id=${event.id}" class="btn outline-btn">View Details</a>
                <a href="event-rsvp.html?id=${event.id}" class="btn primary-btn">RSVP</a>
              </div>
            </div>
          `;
        });

        eventsGrid.innerHTML = eventsHTML;
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        eventsGrid.innerHTML = '<p>Error loading events. Please try again later.</p>';
      });
  }

  // Load events on homepage if events grid exists
  if (document.querySelector('.events-grid')) {
    fetchEvents();
  }
});