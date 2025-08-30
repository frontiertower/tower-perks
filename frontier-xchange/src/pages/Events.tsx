import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Calendar, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Zap,
  Award,
  BookOpen,
  Wrench
} from 'lucide-react';
import printingMasterclassImage from '@/assets/3d-printing-masterclass.jpg';
import laserCuttingImage from '@/assets/laser-cutting-workshop.jpg';

interface Event {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'talk' | 'social' | 'competition';
  date: string;
  time: string;
  duration: number; // in minutes
  location: string;
  capacity: number;
  registered: number;
  price: number;
  instructor: {
    name: string;
    avatar?: string;
    title: string;
    rating: number;
  };
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  featured: boolean;
  tags: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: '3D Printing Masterclass',
    description: 'Learn advanced 3D printing techniques, material selection, and troubleshooting. Hands-on experience with multiple printer types.',
    category: 'workshop',
    date: '2024-02-15',
    time: '14:00',
    duration: 180,
    location: '3D Printing Lab',
    capacity: 12,
    registered: 8,
    price: 25,
    instructor: {
      name: 'Dr. Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      title: 'Senior Engineer, SpaceX',
      rating: 4.9
    },
    skills: ['3D Modeling', 'Material Science', 'CAD'],
    difficulty: 'intermediate',
    imageUrl: printingMasterclassImage,
    featured: true,
    tags: ['3d-printing', 'prototyping', 'design']
  },
  {
    id: '2',
    title: 'Arduino IoT Workshop',
    description: 'Build your first IoT device using Arduino and WiFi modules. Create a smart sensor system you can monitor from anywhere.',
    category: 'workshop',
    date: '2024-02-18',
    time: '18:30',
    duration: 120,
    location: 'Electronics Lab',
    capacity: 15,
    registered: 12,
    price: 15,
    instructor: {
      name: 'Alex Rodriguez',
      avatar: '/avatars/alex.jpg',
      title: 'IoT Consultant',
      rating: 4.7
    },
    skills: ['Arduino', 'IoT', 'Programming'],
    difficulty: 'beginner',
    featured: false,
    tags: ['arduino', 'iot', 'electronics']
  },
  {
    id: '3',
    title: 'Laser Cutting Design Principles',
    description: 'Master the art of laser cutting design. Learn kerf compensation, joint design, and material optimization.',
    category: 'workshop',
    date: '2024-02-20',
    time: '19:00',
    duration: 90,
    location: 'Laser Cutting Area',
    capacity: 8,
    registered: 6,
    price: 20,
    instructor: {
      name: 'Maria Santos',
      avatar: '/avatars/maria.jpg',
      title: 'Product Designer',
      rating: 4.8
    },
    skills: ['Laser Cutting', 'Design', 'CAD'],
    difficulty: 'intermediate',
    imageUrl: laserCuttingImage,
    featured: true,
    tags: ['laser-cutting', 'design', 'fabrication']
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Present your maker project to a panel of investors and industry experts. Winner receives $5000 in funding and mentorship.',
    category: 'competition',
    date: '2024-02-25',
    time: '15:00',
    duration: 240,
    location: 'Main Auditorium',
    capacity: 50,
    registered: 23,
    price: 0,
    instructor: {
      name: 'Competition Committee',
      title: 'Various Industry Experts',
      rating: 5.0
    },
    skills: ['Pitching', 'Business', 'Presentation'],
    difficulty: 'advanced',
    featured: true,
    tags: ['startup', 'competition', 'funding']
  },
  {
    id: '5',
    title: 'Coffee & Code Social',
    description: 'Casual meet-up for makers to share projects, get feedback, and network. Refreshments provided.',
    category: 'social',
    date: '2024-02-12',
    time: '17:00',
    duration: 120,
    location: 'Community Lounge',
    capacity: 30,
    registered: 18,
    price: 0,
    instructor: {
      name: 'Community Team',
      title: 'Makerspace Staff',
      rating: 4.5
    },
    skills: ['Networking', 'Collaboration'],
    difficulty: 'beginner',
    featured: false,
    tags: ['social', 'networking', 'community']
  },
  {
    id: '6',
    title: 'The Future of Manufacturing',
    description: 'Industry expert discusses emerging trends in additive manufacturing, automation, and sustainable production.',
    category: 'talk',
    date: '2024-02-28',
    time: '18:00',
    duration: 60,
    location: 'Main Auditorium',
    capacity: 100,
    registered: 45,
    price: 0,
    instructor: {
      name: 'Dr. Michael Zhang',
      avatar: '/avatars/michael.jpg',
      title: 'VP of Innovation, Tesla',
      rating: 4.9
    },
    skills: ['Manufacturing', 'Innovation', 'Sustainability'],
    difficulty: 'intermediate',
    featured: true,
    tags: ['manufacturing', 'innovation', 'future']
  }
];

const categories = [
  { value: 'all', label: 'All Events', icon: Calendar },
  { value: 'workshop', label: 'Workshops', icon: Wrench },
  { value: 'talk', label: 'Talks', icon: BookOpen },
  { value: 'competition', label: 'Competitions', icon: Award },
  { value: 'social', label: 'Social', icon: Users }
];

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

export default function Events() {
  const navigate = useNavigate();
  const [events] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'upcoming' | 'calendar'>('upcoming');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workshop': return 'bg-primary/10 text-primary border-primary/20 font-medium';
      case 'talk': return 'bg-info/10 text-info border-info/20 font-medium';
      case 'competition': return 'bg-warning/10 text-warning-foreground border-warning/20 font-medium';
      case 'social': return 'bg-success/10 text-success border-success/20 font-medium';
      default: return 'bg-muted/10 text-muted-foreground border-border font-medium';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/10 text-success border-success/20 font-medium';
      case 'intermediate': return 'bg-warning/10 text-warning-foreground border-warning/20 font-medium';
      case 'advanced': return 'bg-error/10 text-error border-error/20 font-medium';
      default: return 'bg-muted/10 text-muted-foreground border-border font-medium';
    }
  };

  const filteredEvents = events.filter(event => {
    return (
      (selectedCategory === 'all' || event.category === selectedCategory) &&
      (selectedDifficulty === 'all' || event.difficulty === selectedDifficulty) &&
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const upcomingEvents = filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Events & Workshops"
          subtitle="Join workshops, attend talks, and participate in competitions. Expand your skills with hands-on learning experiences."
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
            onClick={() => navigate('/events')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
            onClick={() => setViewMode(viewMode === 'upcoming' ? 'calendar' : 'upcoming')}
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            {viewMode === 'upcoming' ? 'Calendar View' : 'List View'}
          </Button>
        </PageHeader>

        {/* Stats Bar */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center animate-fade-in">
                <div className="text-2xl font-bold text-primary mb-1">{events.length}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="text-2xl font-bold text-primary mb-1">
                  {events.filter(e => e.category === 'workshop').length}
                </div>
                <div className="text-sm text-muted-foreground">Workshops</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl font-bold text-primary mb-1">
                  {events.reduce((sum, e) => sum + e.registered, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Registrations</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="text-2xl font-bold text-primary mb-1">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6 animate-slide-in-left">
                <Zap className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Featured Events</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredEvents.slice(0, 2).map((event, index) => (
                  <Card 
                    key={event.id} 
                    className="group glass border-border hover:border-primary/30 transition-all duration-300 overflow-hidden animate-slide-in-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {event.imageUrl ? (
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-primary"></div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`text-xs ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(event.difficulty)}`}>
                            {event.difficulty}
                          </Badge>
                          {event.featured && (
                            <Badge className="text-xs bg-gradient-primary text-white animate-pulse">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {event.price === 0 ? 'Free' : `$${event.price}`}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                          <span>{event.time} ({event.duration}min)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{event.registered}/{event.capacity} registered</span>
                          <div className="flex-1 bg-background-secondary h-2 ml-2">
                            <div 
                              className="h-2 bg-primary transition-all duration-500"
                              style={{width: `${(event.registered / event.capacity) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={event.instructor.avatar} />
                            <AvatarFallback>{event.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{event.instructor.name}</div>
                            <div className="text-xs text-muted-foreground">{event.instructor.title}</div>
                          </div>
                        </div>
                        <Button className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
                          Register
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="glass-strong p-6 mb-8 animate-slide-in-up border border-border/50">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search events, skills, or instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <category.icon className="w-4 h-4 mr-1" />
                    {category.label}
                  </Button>
                ))}
              </div>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-background/50 border border-border/50 text-foreground focus:border-primary/50 focus:outline-none"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card 
                key={event.id} 
                className="group glass border-border hover:border-primary/30 transition-all duration-300 overflow-hidden animate-slide-in-up"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge className={`text-xs ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(event.difficulty)}`}>
                        {event.difficulty}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <Clock className="w-3 h-3 text-muted-foreground ml-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span>{event.registered}/{event.capacity} spots</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={event.instructor.avatar} />
                        <AvatarFallback className="text-xs">
                          {event.instructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs text-muted-foreground">
                        {event.instructor.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-neon-yellow fill-neon-yellow" />
                      <span className="text-sm font-medium">{event.instructor.rating}</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16 animate-slide-in-up">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}