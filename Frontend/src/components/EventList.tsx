import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Booking, Event } from '../types';
import toast from 'react-hot-toast';
import { checkUserBookedEvent, createBooking } from '../services/booking';
import EventCard from './EventCard';


interface EventListProps {
  events: Event[];
  userBookings?: Booking[];
  onBookingCreated?: () => void;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  userBookings = [],
  onBookingCreated 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [bookedEventIds, setBookedEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Extract event IDs from user bookings
    if (userBookings.length > 0) {
      const bookedIds = new Set(userBookings.map(booking => booking.event_id));
      setBookedEventIds(bookedIds);
    }
  }, [userBookings]);

  useEffect(() => {
    // Filter events based on search term
    if (searchTerm.trim() === '') {
      setFilteredEvents(events);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = events.filter(event => 
        event.name.toLowerCase().includes(lowercasedSearch) ||
        event.description.toLowerCase().includes(lowercasedSearch) ||
        event.category.toLowerCase().includes(lowercasedSearch) ||
        event.location.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  const handleBook = async (eventId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Check if already booked
      const isBooked = await checkUserBookedEvent(eventId);
      if (isBooked) {
        toast('You have already booked this event!');
        return;
      }

      // Create a new booking
      await createBooking(eventId, 1); // Assuming 1 ticket for simplicity
      toast.success('Booking created successfully!');
      setBookedEventIds(prev => new Set(prev).add(eventId));
      
      if (onBookingCreated) {
        onBookingCreated();
      }
      
      // Redirect to a success page
      navigate(`/booking-success/${eventId}`);
    } catch (error) {
      console.error('Error booking event:', error);
      alert('Failed to book event. Please try again.');
    }
  };

  return (
    <div>
      {/* Search bar */}
      <div className="relative max-w-xl mx-auto mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="form-input pl-10"
          placeholder="Search for events by title, category, or location..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Events grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isBooked={bookedEventIds.has(event.id)}
              onBook={() => handleBook(event.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No events found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or check back later for new events.</p>
        </div>
      )}
    </div>
  );
};

export default EventList;