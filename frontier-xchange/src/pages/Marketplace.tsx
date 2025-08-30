import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Heart,
  Plus,
  Zap,
  Package,
  TrendingUp
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  memberPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  seller: {
    name: string;
    avatar?: string;
    rating: number;
  };
  imageUrl?: string;
  featured: boolean;
  inStock: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Custom 3D Printed Phone Case',
    description: 'Personalized phone case with your design. High-quality PLA+ material with precise fit.',
    price: 25,
    memberPrice: 20,
    category: '3D Printing',
    rating: 4.8,
    reviews: 24,
    seller: {
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      rating: 4.9
    },
    featured: true,
    inStock: true
  },
  {
    id: '2',
    title: 'Arduino Starter Kit Pro',
    description: 'Complete electronics kit with Arduino Uno, sensors, and comprehensive tutorial guide.',
    price: 75,
    memberPrice: 65,
    category: 'Electronics',
    rating: 4.9,
    reviews: 56,
    seller: {
      name: 'TechMaker Store',
      avatar: '/avatars/techmaker.jpg',
      rating: 4.8
    },
    featured: true,
    inStock: true
  }
];

export default function Marketplace() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Community Marketplace"
          subtitle="Discover unique projects, custom services, and maker supplies from our creative community."
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            List Product
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/60 px-8 py-4"
          >
            <Package className="w-5 h-5 mr-2" />
            My Shop
          </Button>
        </PageHeader>

        {/* Stats Bar */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center animate-fade-in">
                <div className="text-2xl font-bold text-primary mb-1">342</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="text-2xl font-bold text-primary mb-1">89</div>
                <div className="text-sm text-muted-foreground">Sellers</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl font-bold text-primary mb-1">1.2K</div>
                <div className="text-sm text-muted-foreground">Orders</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="text-2xl font-bold text-primary mb-1">4.7</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search */}
          <div className="glass p-6 mb-8 animate-slide-in-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products, categories, or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="group bg-card/50 border-border/50 hover-lift overflow-hidden animate-slide-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative h-48 bg-gradient-primary">
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 hover-glow">
                      <Heart className="w-4 h-4" />
                    </Button>
                    {product.featured && (
                      <Badge className="text-xs bg-gradient-primary text-white animate-pulse">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-neon-yellow fill-current" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {product.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={product.seller.avatar} />
                        <AvatarFallback className="text-xs">
                          {product.seller.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs text-muted-foreground">
                        {product.seller.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-neon-yellow fill-current" />
                      <span className="text-xs">{product.seller.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-primary">${product.price}</div>
                      {product.memberPrice && (
                        <div className="text-xs text-neon-green">
                          Member: ${product.memberPrice}
                        </div>
                      )}
                    </div>
                    <Button size="sm" className="hover-lift">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}