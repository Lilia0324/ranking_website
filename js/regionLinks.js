// Function to generate region links
function generateRegionLink(region, service) {
    return `/top-${service}-services-in-${region}`;
}

// Export function for use in other files
window.generateRegionLink = generateRegionLink; 