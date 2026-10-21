import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TripBuilder from './components/TripBuilder';
import ItineraryView from './components/ItineraryView';
import SavedTrips from './components/SavedTrips';
import DestinationModal from './components/DestinationModal';
import { curatedDestinations } from '../server/data/destinations';
import { generateItinerary } from '../server/services/itineraryEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'builder' | 'itinerary' | 'saved'
  const [currency, setCurrency] = useState('USD');
  const [destinations, setDestinations] = useState(curatedDestinations);
  const [savedTrips, setSavedTrips] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [builderDestination, setBuilderDestination] = useState('');
  const [selectedDestinationModal, setSelectedDestinationModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved trips from API or localStorage
  useEffect(() => {
    // 1. Fetch from localStorage first for instant load
    try {
      const local = localStorage.getItem('wayfarer_saved_trips');
      if (local) {
        setSavedTrips(JSON.parse(local));
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }

    // 2. Sync with backend API
    fetch('/api/trips')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data && data.length > 0) {
          setSavedTrips(data);
          try {
            localStorage.setItem('wayfarer_saved_trips', JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.log('Backend sync note: running in local client mode', err);
      });

    // 3. Fetch destinations from API
    fetch('/api/destinations')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) {
          setDestinations(data);
        }
      })
      .catch(() => {});
  }, []);

  // Save trip to state, API, and localStorage
  const handleSaveTrip = async (trip) => {
    // Update local state
    const existingIndex = savedTrips.findIndex((t) => t.id === trip.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...savedTrips];
      updated[existingIndex] = trip;
    } else {
      updated = [trip, ...savedTrips];
    }
    setSavedTrips(updated);
    try {
      localStorage.setItem('wayfarer_saved_trips', JSON.stringify(updated));
    } catch (e) {}

    // Send to backend API
    try {
      await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip),
      });
    } catch (e) {
      console.warn('API save offline fallback');
    }
  };

  // Delete trip
  const handleDeleteTrip = async (tripId) => {
    const updated = savedTrips.filter((t) => t.id !== tripId);
    setSavedTrips(updated);
    try {
      localStorage.setItem('wayfarer_saved_trips', JSON.stringify(updated));
    } catch (e) {}

    try {
      await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
    } catch (e) {}
  };

  // Duplicate trip
  const handleDuplicateTrip = (trip) => {
    const duplicated = {
      ...trip,
      id: `trip-${Date.now()}`,
      destination: `${trip.destination} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    handleSaveTrip(duplicated);
  };

  // Generate itinerary
  const handleGenerateItinerary = async (formValues) => {
    setIsLoading(true);
    try {
      // Attempt backend API generation
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formValues, currency }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentItinerary(data.itinerary);
        setActiveTab('itinerary');
      } else {
        // Fallback to client-side generator engine
        const plan = generateItinerary({ ...formValues, currency });
        setCurrentItinerary(plan);
        setActiveTab('itinerary');
      }
    } catch (err) {
      console.warn('Backend unavailable, generating client-side', err);
      const plan = generateItinerary({ ...formValues, currency });
      setCurrentItinerary(plan);
      setActiveTab('itinerary');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to TripBuilder with a specific destination
  const handlePlanWithDestination = (destName) => {
    setBuilderDestination(destName);
    setActiveTab('builder');
  };

  // Start a fresh new trip
  const handleStartNewTrip = () => {
    setBuilderDestination('');
    setActiveTab('builder');
  };

  // Open existing trip from saved list
  const handleOpenTrip = (trip) => {
    setCurrentItinerary(trip);
    setActiveTab('itinerary');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#14232c]">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedTrips.length}
        currency={currency}
        setCurrency={setCurrency}
        onStartNewTrip={handleStartNewTrip}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <Hero
            destinations={destinations}
            onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
            onPlanWithDestination={handlePlanWithDestination}
            currency={currency}
          />
        )}

        {activeTab === 'builder' && (
          <TripBuilder
            initialDestination={builderDestination}
            destinations={destinations}
            currency={currency}
            onGenerate={handleGenerateItinerary}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'itinerary' && currentItinerary && (
          <ItineraryView
            itinerary={currentItinerary}
            currency={currency}
            onSaveTrip={handleSaveTrip}
            isSaved={savedTrips.some((t) => t.id === currentItinerary.id)}
            onBack={() => setActiveTab('builder')}
            onReplan={() => {
              setBuilderDestination(currentItinerary.destination);
              setActiveTab('builder');
            }}
          />
        )}

        {activeTab === 'saved' && (
          <SavedTrips
            trips={savedTrips}
            onOpenTrip={handleOpenTrip}
            onDeleteTrip={handleDeleteTrip}
            onDuplicateTrip={handleDuplicateTrip}
            onStartNewTrip={handleStartNewTrip}
            currency={currency}
          />
        )}
      </main>

      {/* Destination Fact Modal */}
      {selectedDestinationModal && (
        <DestinationModal
          destination={selectedDestinationModal}
          onClose={() => setSelectedDestinationModal(null)}
          onPlanWithDestination={handlePlanWithDestination}
          currency={currency}
        />
      )}

      {/* Footer (Hidden in Print) */}
      <footer className="no-print border-t border-[#ece6d9] bg-[#f8f5ee] py-12 text-[#5a6b73] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#144355] text-sm tracking-tight">Wayfarer</span>
            <span>— AI Travel Itinerary Planner</span>
          </div>
          <p className="text-center sm:text-right">
            Plan, customize, and export personalized travel plans worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}
