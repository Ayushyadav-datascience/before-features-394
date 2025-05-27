document.addEventListener('DOMContentLoaded', function() {
  // Initial page load - get query params
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('search');
  
  // Set initial search value if present
  if (searchParam) {
    document.getElementById('search-input').value = searchParam;
  }
  
  // Set initial category if provided in URL
  if (categoryParam) {
    const categoryButtons = document.querySelectorAll('.filter-btn');
    categoryButtons.forEach(btn => {
      if (btn.dataset.category === categoryParam) {
        btn.classList.add('active');
      } else if (btn.classList.contains('active')) {
        btn.classList.remove('active');
      }
    });
  }
  
  // Search functionality
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  searchBtn.addEventListener('click', function() {
    searchEvents();
  });
  
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      searchEvents();
    }
  });
  
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
      
      // Update URL with new category
      updateUrlParams('category', category !== 'all' ? category : null);
      
      // Filter events by category
      fetchEvents(category, searchInput.value.trim());
    });
  });

  function updateUrlParams(key, value) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    url.search = params.toString();
    window.history.replaceState({}, '', url.toString());
  }
  
  function searchEvents() {
    const searchQuery = searchInput.value.trim();
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    
    // Update URL with search query
    updateUrlParams('search', searchQuery);
    
    fetchEvents(activeCategory, searchQuery);
  }
  
  function fetchEvents(category = 'all', search = '') {
    const eventsGrid = document.getElementById('events-grid');
    const noEventsMessage = document.getElementById('no-events-message');
    
    if (!eventsGrid) return;
    
    // Build API URL with parameters
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
    eventsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading events...</div>';
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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
          const eventDate = new Date(event.date);
          const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', month: 'short', day: 'numeric' 
          });
          
          const attendeesCount = event.attendees ? event.attendees.length : 0;
          
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
                    <span>${formattedDate}</span>
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
                    <span>${attendeesCount} attending</span>
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
  
  // Initial fetch based on URL parameters
  fetchEvents(
    categoryParam || 'all',
    searchParam || ''
  );
}); 