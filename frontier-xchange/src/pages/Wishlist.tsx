import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Plus, Search, Filter, ChevronUp, ChevronDown, Clock, DollarSign, Users, TrendingUp, Sparkles } from 'lucide-react';

interface WishItem {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedCost: number;
  votes: number;
  dateAdded: string;
  author: string;
  status: 'pending' | 'approved' | 'purchased' | 'rejected';
  userVoted: boolean;
  trending: boolean;
}

const mockWishItems: WishItem[] = [
  {
    id: '1',
    title: '3D Printer - Bambu Lab X1 Carbon',
    description: 'High-speed, precision 3D printer with automatic bed leveling and multi-material support. Perfect for prototyping and production.',
    category: '3D Printing',
    estimatedCost: 1200,
    votes: 87,
    dateAdded: '2024-01-15',
    author: 'Alex Chen',
    status: 'pending',
    userVoted: false,
    trending: true
  },
  {
    id: '2',
    title: 'Oscilloscope - Rigol DS1054Z',
    description: 'Digital storage oscilloscope with 4 channels and 50 MHz bandwidth. Essential for electronics projects and debugging.',
    category: 'Electronics',
    estimatedCost: 350,
    votes: 64,
    dateAdded: '2024-01-20',
    author: 'Maria Rodriguez',
    status: 'approved',
    userVoted: true,
    trending: false
  },
  {
    id: '3',
    title: 'CNC Router Table',
    description: 'Professional-grade CNC router for precision milling of wood, plastic, and soft metals. Includes dust collection system.',
    category: 'Woodworking',
    estimatedCost: 2500,
    votes: 45,
    dateAdded: '2024-01-10',
    author: 'James Wilson',
    status: 'pending',
    userVoted: false,
    trending: true
  },
  {
    id: '4',
    title: 'Soldering Station - Hakko FX-971',
    description: 'Temperature-controlled soldering station with digital display and precision tip. Great for fine electronics work.',
    category: 'Electronics',
    estimatedCost: 180,
    votes: 38,
    dateAdded: '2024-01-25',
    author: 'Sarah Kim',
    status: 'purchased',
    userVoted: false,
    trending: false
  },
  {
    id: '5',
    title: 'Laser Engraver - xTool D1 Pro',
    description: 'Compact desktop laser engraver for wood, acrylic, and leather. Perfect for personalization and small production runs.',
    category: 'Laser Cutting',
    estimatedCost: 800,
    votes: 52,
    dateAdded: '2024-01-18',
    author: 'Michael Turner',
    status: 'pending',
    userVoted: true,
    trending: false
  }
];

const categories = ['All', '3D Printing', 'Electronics', 'Woodworking', 'Laser Cutting', 'Metalworking', 'Textiles'];
const sortOptions = ['Most Voted', 'Recent', 'Price: Low to High', 'Price: High to Low'];

export default function Wishlist() {
  const [wishItems, setWishItems] = useState<WishItem[]>(mockWishItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Most Voted');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleVote = (id: string) => {
    setWishItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              votes: item.userVoted ? item.votes - 1 : item.votes + 1,
              userVoted: !item.userVoted
            }
          : item
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'purchased': return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30';
      case 'rejected': return 'bg-neon-red/20 text-neon-red border-neon-red/30';
      default: return 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30';
    }
  };

  const filteredAndSortedItems = wishItems
    .filter(item => 
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'Most Voted': return b.votes - a.votes;
        case 'Recent': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'Price: Low to High': return a.estimatedCost - b.estimatedCost;
        case 'Price: High to Low': return b.estimatedCost - a.estimatedCost;
        default: return 0;
      }
    });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Community Wishlist"
          subtitle="Vote for equipment and tools you want to see in our makerspace. Your voice drives our next acquisitions."
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Submit New Wish
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/60 px-8 py-4"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View Trending
          </Button>
        </PageHeader>

        {/* Stats Bar */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center animate-slide-in-left">
                <div className="text-2xl font-bold text-primary mb-1">127</div>
                <div className="text-sm text-muted-foreground">Total Wishes</div>
              </div>
              <div className="text-center animate-slide-in-left" style={{animationDelay: '0.1s'}}>
                <div className="text-2xl font-bold text-primary mb-1">23</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
              <div className="text-center animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl font-bold text-primary mb-1">8</div>
                <div className="text-sm text-muted-foreground">Purchased</div>
              </div>
              <div className="text-center animate-slide-in-left" style={{animationDelay: '0.3s'}}>
                <div className="text-2xl font-bold text-primary mb-1">$12.5K</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="glass p-6 mb-8 animate-slide-in-up">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search wishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="hover-lift"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-background/50 border border-border/50 text-foreground focus:border-primary/50 focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="group bg-card/50 border-border/50 hover-lift overflow-hidden animate-slide-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        {item.trending && (
                          <Badge className="text-xs bg-gradient-primary text-white animate-pulse">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                    </div>
                    <div className="flex flex-col items-center ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(item.id)}
                        className={`p-2 hover:scale-110 transition-all ${
                          item.userVoted 
                            ? 'text-primary bg-primary/20 hover:bg-primary/30' 
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                        }`}
                      >
                        <ChevronUp className="w-5 h-5" />
                      </Button>
                      <span className={`text-sm font-bold ${item.userVoted ? 'text-primary' : 'text-foreground'}`}>
                        {item.votes}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-4 line-clamp-3">
                    {item.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-primary">${item.estimatedCost}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      by {item.author}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{item.votes} votes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-16 animate-slide-in-up">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No wishes found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => setShowCreateForm(true)} className="hover-lift">
                <Plus className="w-4 h-4 mr-2" />
                Submit the first wish
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}