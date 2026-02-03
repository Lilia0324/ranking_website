const regionData = {
    // China
    'china': {
        devTools: {
            title: 'Dev Tools in China',
            description: 'Discover the best development tools for Chinese developers. These tools will enhance your coding workflow.',
            benefits: [
                'Accelerate development speed',
                'Improve code quality',
                'Better team collaboration',
                'Enhanced debugging capabilities'
            ]
        },
        productivityApps: {
            title: 'Productivity Apps in China',
            description: 'Find the best productivity apps for Chinese teams. Streamline your work with these top-rated tools.',
            benefits: [
                'Efficient task management',
                'Better team collaboration',
                'Time tracking and analytics',
                'Seamless workflow automation'
            ]
        },
    },

    'indonesia': generateRegionData('Indonesia'),
    'pakistan': generateRegionData('Pakistan'),
    'nigeria': generateRegionData('Nigeria'),
    'brazil': generateRegionData('Brazil'),
    'bangladesh': generateRegionData('Bangladesh'),
    'russia': generateRegionData('Russia'),
    'mexico': generateRegionData('Mexico'),
    'japan': {
        eor: {
            title: 'EOR Services in Japan',
            description: 'When expanding your business in Japan, choosing the right EOR service provider is crucial. Here are our recommended top EOR service providers.',
            benefits: [
                'Quick market entry into Japan',
                'Compliant employment solutions',
                'Localized HR support',
                'Simplified payroll management'
            ],
            cta: 'Contact Us for EOR Services in Japan'
        },
        payroll: {
            title: 'Payroll Services in Japan',
            description: 'Managing payroll in Japan requires professional service providers. Here are our recommendations.',
            benefits: [
                'Accurate payroll calculations',
                'Tax compliance',
                'Localized support',
                'Automated processes'
            ],
            cta: 'Contact Us for Payroll Services in Japan'
        }
    },
    'philippines': generateRegionData('Philippines'),
    'ethiopia': generateRegionData('Ethiopia'),
    'democratic-republic-of-the-congo': generateRegionData('Democratic Republic of the Congo'),
    'egypt': generateRegionData('Egypt'),
    'vietnam': generateRegionData('Vietnam'),
    'iran': generateRegionData('Iran'),
    'turkey': generateRegionData('Turkey'),
    'thailand': generateRegionData('Thailand'),
    'south-africa': generateRegionData('South Africa'),
};

// Helper function to generate region data
function generateRegionData(regionName) {
    return {
        devTools: {
            title: `Dev Tools in ${regionName}`,
            description: `Discover the best development tools for ${regionName} developers. These tools will enhance your coding workflow and boost productivity.`,
            benefits: [
                'Accelerate development speed',
                'Improve code quality',
                'Better collaboration',
                'Enhanced debugging capabilities'
            ]
        },
        productivityApps: {
            title: `Productivity Apps in ${regionName}`,
            description: `Find the best productivity apps for ${regionName} teams. Streamline your work and achieve more with these top-rated tools.`,
            benefits: [
                'Efficient task management',
                'Better team collaboration',
                'Time tracking and analytics',
                'Seamless workflow automation'
            ]
        },

    };
}

// Add data for all remaining regions
[
    'tanzania', 'colombia', 'kenya', 'myanmar', 'sudan',
    'algeria', 'argentina', 'uganda', 'iraq', 'afghanistan',
    'uzbekistan', 'poland', 'morocco', 'angola', 'malaysia', 'peru', 'mozambique',
    'ghana', 'ukraine', 'yemen', 'saudi-arabia', 'madagascar', 'ivory-coast',
    'nepal', 'cameroon', 'venezuela', 'niger', 'north-korea',
    'syria', 'burkina-faso', 'taiwan', 'mali', 'sri-lanka', 'kazakhstan',
    'malawi', 'chile', 'zambia', 'romania', 'somalia', 'chad', 'senegal',
    'netherlands', 'guatemala', 'cambodia', 'ecuador', 'zimbabwe', 'south-sudan',
    'guinea', 'rwanda', 'benin', 'burundi', 'tunisia', 'haiti', 'belgium',
    'papua-new-guinea', 'jordan', 'bolivia', 'cuba', 'czech-republic',
    'dominican-republic', 'united-arab-emirates', 'portugal', 'sweden', 'greece',
    'tajikistan', 'azerbaijan', 'israel', 'honduras', 'hungary', 'austria',
    'belarus', 'switzerland', 'sierra-leone', 'togo', 'laos', 'libya',
    'kyrgyzstan', 'turkmenistan', 'nicaragua', 'serbia', 'central-african-republic',
    'bulgaria', 'republic-of-the-congo', 'paraguay', 'el-salvador', 'denmark',
    'finland', 'norway', 'lebanon', 'palestine', 'slovakia', 'ireland',
    'new-zealand', 'costa-rica', 'oman', 'liberia', 'mauritania', 'kuwait',
    'panama', 'croatia', 'georgia', 'eritrea', 'mongolia', 'uruguay',
    'bosnia-and-herzegovina', 'armenia', 'namibia', 'lithuania', 'qatar',
    'jamaica', 'moldova', 'gambia', 'botswana', 'gabon', 'albania', 'lesotho',
    'slovenia', 'latvia', 'north-macedonia', 'guinea-bissau', 'bahrain',
    'kosovo', 'equatorial-guinea', 'timor-leste', 'estonia', 'trinidad-and-tobago',
    'mauritius', 'eswatini', 'djibouti', 'cyprus', 'fiji', 'comoros', 'bhutan',
    'guyana', 'solomon-islands', 'macau', 'luxembourg', 'montenegro', 'suriname',
    'malta', 'maldives', 'cape-verde', 'brunei', 'belize', 'bahamas', 'iceland',
    'vanuatu', 'barbados', 'samoa', 'saint-lucia', 'seychelles', 'kiribati',
    'grenada', 'saint-vincent-and-the-grenadines', 'micronesia',
    'antigua-and-barbuda', 'tonga', 'andorra', 'dominica', 'saint-kitts-and-nevis',
    'liechtenstein', 'monaco', 'san-marino', 'palau', 'nauru', 'tuvalu',
    'vatican-city'
].forEach(region => {
    if (!regionData[region]) {
        const formattedRegion = region.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        regionData[region] = generateRegionData(formattedRegion);
    }
});

// Export data
window.regionData = regionData; 