import { Clock, Users, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const upcomingEvents = [
  {
    id: '1',
    title: '3D Printing Workshop',
    time: '10:00 AM',
    date: 'Tomorrow',
    instructor: 'Sarah Chen',
    attendees: 8,
    maxAttendees: 12,
    status: 'registered',
    location: 'Fab Lab A',
    skillLevel: 'Beginner'
  },
  {
    id: '2',
    title: 'Electronics Basics',
    time: '2:00 PM', 
    date: 'Friday',
    instructor: 'Mike Rodriguez',
    attendees: 15,
    maxAttendees: 15,
    status: 'waitlist',
    location: 'Electronics Workshop',
    skillLevel: 'Intermediate'
  },
  {
    id: '3',
    title: 'Laser Cutting Safety',
    time: '6:00 PM',
    date: 'Monday',
    instructor: 'Emma Wilson',
    attendees: 6,
    maxAttendees: 10,
    status: 'available',
    location: 'Laser Lab',
    skillLevel: 'All Levels'
  }
];

export function UpcomingEvents() {
  const getStatusBadge = (status: string, attendees: number, maxAttendees: number) => {
    if (status === 'registered') {
      return <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-md">Registered</div>;
    }
    if (status === 'waitlist') {
      return <div className="px-2 py-1 bg-warning/20 text-warning text-xs font-medium rounded-md">Waitlisted</div>;
    }
    if (attendees >= maxAttendees) {
      return <div className="px-2 py-1 bg-destructive/20 text-destructive text-xs font-medium rounded-md">Full</div>;
    }
    return <div className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-md">Available</div>;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-foreground">Upcoming Events</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-sm h-8" onClick={() => window.location.href = '/events'}>
          View All →
        </Button>
      </div>
      
      <div className="space-y-2">
        {upcomingEvents.slice(0, 2).map((event, index) => (
          <div 
            key={event.id} 
            className="p-3 bg-gradient-to-r from-gray-50/80 to-white/80 border border-gray-200/60 rounded-lg hover:border-primary/30 hover:shadow-sm transition-all duration-300 group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  with {event.instructor}
                </p>
              </div>
              {getStatusBadge(event.status, event.attendees, event.maxAttendees)}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary" />
                <span>{event.date}</span>
              </div>
            </div>

            {/* Compact progress bar */}
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-500" 
                  style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>{event.attendees}/{event.maxAttendees} registered</span>
                <span className="text-xs text-muted-foreground">{event.location}</span>
              </div>
            </div>

            {event.status === 'available' && (
              <Button size="sm" className="w-full h-7 text-xs bg-white text-primary hover:bg-white/90">
                Register Now
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}