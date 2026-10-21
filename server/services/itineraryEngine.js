import { curatedDestinations } from '../data/destinations.js';

// Exchange rates relative to USD for multi-currency estimations
export const currencyRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 152.0,
  INR: 84.0,
  AUD: 1.50,
  CAD: 1.38,
  SGD: 1.33,
  CHF: 0.88,
};

// Activity themes and templates for global destination generation
const globalLandmarkPool = [
  { timeSlot: 'Morning', cat: 'Sightseeing', title: 'Historic Old Town & Central Plaza', desc: 'Wander through cobblestone streets, marvel at centuries-old architecture, and visit the iconic central square.' },
  { timeSlot: 'Lunch', cat: 'Dining', title: 'Local Heritage Bistro & Specialty Market', desc: 'Sample regional culinary specialties and fresh seasonal dishes at an authentic neighborhood spot.' },
  { timeSlot: 'Afternoon', cat: 'Experience', title: 'National Museum & Cultural Landmark', desc: 'Explore world-renowned exhibitions, historic artifacts, and contemporary regional art.' },
  { timeSlot: 'Evening', cat: 'Dining', title: 'Sunset Promenade & Riverside Dining', desc: 'Take in panoramic golden hour views followed by a relaxed dinner featuring local wines and dishes.' },
  { timeSlot: 'Morning', cat: 'Sightseeing', title: 'Scenic Viewpoint & Castle / Hilltop Fortress', desc: 'Ascend to the highest vantage point for sweeping 360-degree vistas over the city and surrounding landscapes.' },
  { timeSlot: 'Lunch', cat: 'Dining', title: 'Artisanal Cafe & Bakery Tasting', desc: 'Enjoy handcrafted coffees, local pastries, and fresh brunch plates in a vibrant bohemian quarter.' },
  { timeSlot: 'Afternoon', cat: 'Experience', title: 'Botanical Gardens & Artisan Craft Quarter', desc: 'Stroll through lush gardens, fountains, and independent craft workshops showcasing local ceramics and textiles.' },
  { timeSlot: 'Evening', cat: 'Experience', title: 'Atmospheric Night Bazaar & Tapas Crawl', desc: 'Immerse in the evening buzz with small plates, street delicacies, and live regional music.' },
  { timeSlot: 'Morning', cat: 'Sightseeing', title: 'Historic Waterfront & Maritime Harbor', desc: 'Walk along the historic harbor, take in coastal breezes, and watch local fishermen and sailing boats.' },
  { timeSlot: 'Lunch', cat: 'Dining', title: 'Fresh Catch Seafood / Farm-to-Table Grill', desc: 'Delight in freshly caught seafood or locally farmed seasonal produce prepared with regional herbs.' },
  { timeSlot: 'Afternoon', cat: 'Experience', title: 'Hidden Alleyways & Indie Gallery Crawl', desc: 'Discover quiet courtyards, secret gardens, independent bookstores, and emerging artist galleries.' },
  { timeSlot: 'Evening', cat: 'Dining', title: 'Rooftop Lounge & Signature Culinary Dinner', desc: 'Celebrate the journey with creative cocktails and an unforgettable dining experience overlooking the skyline.' },
];

export function generateItinerary(params) {
  const {
    destination = 'Kyoto, Japan',
    startDate = new Date().toISOString().split('T')[0],
    endDate,
    daysCount,
    travelers = 'couple',
    groupSize = 2,
    budget = 'balanced',
    currency = 'USD',
    pace = 'balanced',
    accommodation = 'boutique',
    interests = ['Culture', 'Culinary'],
    notes = '',
  } = params;

  // Calculate number of days
  let totalDays = 4;
  if (daysCount) {
    totalDays = Math.max(1, Math.min(14, parseInt(daysCount, 10)));
  } else if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    totalDays = Math.max(1, Math.min(14, calculatedDays || 4));
  }

  // Find if destination matches our curated list
  const cleanDest = destination.trim().toLowerCase();
  const matched = curatedDestinations.find(
    (d) =>
      cleanDest.includes(d.name.toLowerCase()) ||
      cleanDest.includes(d.country.toLowerCase()) ||
      d.id.includes(cleanDest)
  );

  // Daily budget base in USD per traveler
  const budgetMultiplier = {
    budget: 0.55,
    balanced: 1.0,
    comfort: 1.85,
    luxury: 4.2,
  }[budget] || 1.0;

  const baseDailyCostUSD = (matched ? matched.dailyBudgetEstimatedUSD[budget] : 130 * budgetMultiplier);
  const rate = currencyRates[currency] || 1.0;

  // Cost estimates
  const totalTripCostUSD = Math.round(baseDailyCostUSD * totalDays * (travelers === 'solo' ? 1 : groupSize * 0.85));
  const accommodationCostUSD = Math.round(totalTripCostUSD * 0.44);
  const foodCostUSD = Math.round(totalTripCostUSD * 0.30);
  const activitiesCostUSD = Math.round(totalTripCostUSD * 0.14);
  const transportCostUSD = Math.round(totalTripCostUSD * 0.08);
  const bufferCostUSD = Math.round(totalTripCostUSD * 0.04);

  // Build Day-by-Day schedule
  const days = [];
  const startObj = new Date(startDate);

  // Determine stops per day based on pace
  const stopsCount = pace === 'relaxed' ? 3 : pace === 'packed' ? 5 : 4;

  const destinationName = matched ? `${matched.name}, ${matched.country}` : destination;
  const heroImage = matched
    ? matched.image
    : `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80`;

  for (let i = 0; i < totalDays; i++) {
    const currentDayDate = new Date(startObj);
    currentDayDate.setDate(startObj.getDate() + i);
    const dateStr = currentDayDate.toISOString().split('T')[0];

    const dayNumber = i + 1;
    let dayTheme = '';
    const activities = [];

    if (matched && matched.highlights && matched.highlights.length >= 2) {
      const h1 = matched.highlights[(i * 2) % matched.highlights.length];
      const h2 = matched.highlights[(i * 2 + 1) % matched.highlights.length];
      dayTheme = `${h1} & ${h2}`;
    } else {
      const genericThemes = [
        `Arrival & Historic Quarter Discovery`,
        `Cultural Landmarks & Culinary Delights`,
        `Panoramic Heights & Hidden Courtyards`,
        `Artisan Markets & Riverside Strolls`,
        `Nature Excursion & Scenic Escapes`,
        `Iconic Architecture & Modern Vibes`,
        `Local Flavors, Leisure & Farewell Sunset`,
      ];
      dayTheme = genericThemes[i % genericThemes.length];
    }

    // Slot 1: Morning
    const morningSight = matched?.highlights?.[(i * 3) % matched.highlights.length] || `Historic Landmark & Viewpoint`;
    activities.push({
      id: `act-${dayNumber}-1`,
      timeSlot: 'Morning',
      time: pace === 'packed' ? '08:30 AM' : '09:30 AM',
      title: morningSight,
      category: 'Sightseeing',
      location: `${destination.split(',')[0]} Historic Center`,
      cost: Math.round(15 * rate * (budget === 'budget' ? 0 : 1)),
      description: `Explore ${morningSight} with morning light. Discover the architectural heritage, photogenic vantage points, and rich stories.`,
      tip: 'Visit early in the morning to beat tour groups and capture golden hour photos.',
      completed: false,
    });

    // Slot 2: Lunch
    const diningRec = matched?.recommendedDining?.[i % (matched?.recommendedDining?.length || 1)];
    activities.push({
      id: `act-${dayNumber}-2`,
      timeSlot: 'Lunch',
      time: '12:45 PM',
      title: diningRec ? `${diningRec.name} (${diningRec.type})` : `Local Bistro & Culinary Tasting`,
      category: 'Dining',
      location: `${destination.split(',')[0]} Food District`,
      cost: Math.round((budget === 'budget' ? 10 : budget === 'luxury' ? 65 : 24) * rate),
      description: diningRec
        ? `Savor authentic regional cuisine. Must-try specialty: ${diningRec.dish}.`
        : `Enjoy farm-fresh local flavors and seasonal comfort food at an acclaimed dining spot.`,
      tip: 'Ask for the house specialty and a glass of regional beverage or tea.',
      completed: false,
    });

    // Slot 3: Afternoon
    const afternoonSight = matched?.highlights?.[(i * 3 + 1) % matched.highlights.length] || `Artisan District & Botanical Promenade`;
    activities.push({
      id: `act-${dayNumber}-3`,
      timeSlot: 'Afternoon',
      time: '02:45 PM',
      title: afternoonSight,
      category: interests.includes('Nature') ? 'Experience' : 'Sightseeing',
      location: `${destination.split(',')[0]} Cultural Quarter`,
      cost: Math.round(18 * rate * (budget === 'budget' ? 0.3 : 1)),
      description: `Immerse in ${afternoonSight}. Discover local culture, quiet garden pathways, and curated boutiques.`,
      tip: 'Great spot for relaxing with an afternoon iced coffee or matcha.',
      completed: false,
    });

    // Slot 4: Evening
    const eveningDining = matched?.recommendedDining?.[(i + 1) % (matched?.recommendedDining?.length || 1)];
    activities.push({
      id: `act-${dayNumber}-4`,
      timeSlot: 'Evening',
      time: '07:00 PM',
      title: eveningDining ? `Dinner at ${eveningDining.name}` : `Sunset Dinner & Evening Atmosphere`,
      category: 'Dining',
      location: `${destination.split(',')[0]} Waterfront / Old Town`,
      cost: Math.round((budget === 'budget' ? 15 : budget === 'luxury' ? 110 : 38) * rate),
      description: eveningDining
        ? `Relax with a memorable dinner. Famous for ${eveningDining.dish} in a warm atmosphere.`
        : `Unwind over locally crafted dishes and drinks with views of illuminated city landmarks.`,
      tip: 'Reserve ahead or arrive slightly before peak dinner hour for optimal seating.',
      completed: false,
    });

    // Slot 5 (if pace is packed)
    if (pace === 'packed') {
      activities.push({
        id: `act-${dayNumber}-5`,
        timeSlot: 'Night',
        time: '09:30 PM',
        title: `Illuminated Skyline & Night Walk`,
        category: 'Experience',
        location: `${destination.split(',')[0]} Entertainment District`,
        cost: Math.round(12 * rate),
        description: `Stroll through lit-up streets, bustling late-night dessert parlors, or atmospheric rooftop vistas.`,
        tip: 'Check local transit schedules for the last train or bus of the evening.',
        completed: false,
      });
    }

    // Limit activities to stopsCount if relaxed
    if (pace === 'relaxed') {
      activities.splice(2, 1); // Remove afternoon rush to allow long lunch & leisure
    }

    days.push({
      dayNumber,
      date: dateStr,
      theme: dayTheme,
      activities,
    });
  }

  // Recommended Hotels
  const recommendedHotels = matched?.recommendedStays?.map((h) => ({
    name: h.name,
    type: h.type.charAt(0).toUpperCase() + h.type.slice(1),
    area: h.area,
    pricePerNight: Math.round(h.priceUSD * rate),
    rating: h.rating,
  })) || [
    { name: `The Grand Heritage ${destination.split(',')[0]}`, type: 'Boutique', area: 'Historic Center', pricePerNight: Math.round(145 * rate), rating: 4.8 },
    { name: `Nomad Haven & Suites`, type: 'Hotel', area: 'Downtown', pricePerNight: Math.round(85 * rate), rating: 4.6 },
    { name: `Royal Palace & Spa`, type: 'Luxury', area: 'Riverside', pricePerNight: Math.round(380 * rate), rating: 4.9 },
  ];

  // Recommended Restaurants
  const recommendedRestaurants = matched?.recommendedDining?.map((r) => ({
    name: r.name,
    type: r.type,
    dish: r.dish,
    priceRange: r.cost,
  })) || [
    { name: `Trattoria & Bistro ${destination.split(',')[0]}`, type: 'Regional Cuisine', dish: 'Signature Chef Special', priceRange: '$$' },
    { name: `Old Town Street Food Market`, type: 'Local Delicacies', dish: 'Fresh Griddled Street Snacks', priceRange: '$' },
    { name: `Skyline Panoramic Dining`, type: 'Modern Fine Dining', dish: 'Seasonal Degustation Menu', priceRange: '$$$$' },
  ];

  return {
    id: `trip-${Date.now()}`,
    destination: destinationName,
    country: matched?.country || 'Global',
    startDate,
    endDate: days[days.length - 1].date,
    totalDays,
    travelers,
    groupSize: travelers === 'solo' ? 1 : parseInt(groupSize, 10) || 2,
    budget,
    currency,
    pace,
    accommodation,
    interests,
    notes,
    createdAt: new Date().toISOString(),
    heroImage,
    destinationOverview: {
      bestSeason: matched?.bestSeasons || 'Spring (Apr–May) & Autumn (Sep–Nov)',
      currency: matched?.currency || currency,
      transitTips: matched?.transitTips || 'Use contactless tap-and-go public transit cards or ride-hailing apps for effortless commuting.',
      weatherSummary: matched?.weatherSummary || 'Comfortable seasonal temperatures. Layered clothing recommended.',
    },
    budgetBreakdown: {
      accommodation: Math.round(accommodationCostUSD * rate),
      foodAndDining: Math.round(foodCostUSD * rate),
      activitiesAndEntry: Math.round(activitiesCostUSD * rate),
      transport: Math.round(transportCostUSD * rate),
      buffer: Math.round(bufferCostUSD * rate),
      totalEstimated: Math.round(totalTripCostUSD * rate),
    },
    recommendedHotels,
    recommendedRestaurants,
    days,
  };
}
