function timeDiffInHours(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = Math.abs(d1 - d2); // difference in milliseconds
    return diffMs / (1000 * 60 * 60); // convert to hours
}

// Function to calculate a relevance score for an event
function calculateScore(event, userAttendedCategories, userAttendedTags, userAttendedEventIds, allEvents) {
    let score = 0;
    const now = new Date();
    const eventDate = new Date(event.date);

    if (userAttendedCategories.includes(event.category)) {
        score += 10;
    }

    if (event.tags && userAttendedTags.length > 0) {
        const commonTags = event.tags.filter(tag => userAttendedTags.includes(tag));
        score += commonTags.length * 3; // Each matching tag adds score
    }

    // Factor 2: Popularity (based on number of attendees)
    // Normalize attendee count - simple approach: more attendees = higher score
    const maxAttendees = allEvents.reduce((max, e) => Math.max(max, e.attendees ? e.attendees.length : 0), 0);
    if (maxAttendees > 0 && event.attendees) {
        score += (event.attendees.length / maxAttendees) * 5; // Up to 5 points for popularity
    }

    // Factor 3: Recency/Timeliness (prioritize upcoming events, penalize very old/far-off events)
    const diffDays = (eventDate - now) / (1000 * 60 * 60 * 24);

    if (diffDays >= 0) { // Upcoming events
        if (diffDays <= 7) { // Events in the next 7 days get a boost
            score += 8;
        } else if (diffDays <= 30) { // Events in the next 30 days get a smaller boost
            score += 4;
        } else { // Events further in the future
            score += 1;
        }
    } else { // Past events (should not be recommended, or get negative score)
        score -= 100; // Strongly penalize past events
    }

    return score;
}

// Main function to generate recommendations
function generateRecommendations(user, allEvents) {
    if (!user || !user.attendedEventIds || user.attendedEventIds.length === 0) {
        // If user has no attended events, recommend popular upcoming events
        return allEvents
            .filter(event => new Date(event.date) >= new Date()) // Only upcoming
            .sort((a, b) => (b.attendees ? b.attendees.length : 0) - (a.attendees ? a.attendees.length : 0)) // Sort by popularity
            .slice(0, 5); // Return top 5 popular
    }

    // Get categories and tags from events the user has attended
    const userAttendedCategories = new Set();
    const userAttendedTags = new Set();
    
    // First, collect categories and tags from attended events
    user.attendedEventIds.forEach(attendedId => {
        const attendedEvent = allEvents.find(e => e.id === attendedId);
        if (attendedEvent) {
            userAttendedCategories.add(attendedEvent.category);
            if (attendedEvent.tags) {
                attendedEvent.tags.forEach(tag => userAttendedTags.add(tag));
            }
        }
    });

    const categoriesArray = Array.from(userAttendedCategories);
    const tagsArray = Array.from(userAttendedTags);

    const recommendations = allEvents
        .map(event => {
            // Exclude events the user has already attended or created
            const isAttended = user.attendedEventIds.includes(event.id);
            const isCreator = event.creator && event.creator.id === user.email;

            if (isAttended || isCreator) {
                return { event, score: -Infinity }; // Give a very low score to exclude
            }

            const score = calculateScore(event, categoriesArray, tagsArray, user.attendedEventIds, allEvents);
            return { event, score };
        })
        .filter(item => item.score > -Infinity) // Remove excluded events
        .sort((a, b) => b.score - a.score) // Sort by highest score
        .map(item => item.event); // Return just the event objects

    return recommendations;
}