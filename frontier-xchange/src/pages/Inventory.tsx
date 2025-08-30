import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { 
  Search, 
  ScanLine, 
  Grid3X3, 
  List, 
  Package, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Clock,
  User,
  Settings,
  Filter,
  Plus,
  Scan
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  sku: string;
  location: string;
  status: 'available' | 'checked-out' | 'maintenance' | 'reserved';
  quantity: number;
  totalQuantity: number;
  imageUrl?: string;
  lastUpdated: string;
  checkedOutBy?: string;
  dueDate?: string;
  tags: string[];
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Arduino Uno R3',
    category: 'Electronics',
    description: 'Microcontroller board based on the ATmega328P. Perfect for prototyping and learning.',
    sku: 'ARD-UNO-001',
    location: 'Electronics Lab - Shelf A2',
    status: 'available',
    quantity: 12,
    totalQuantity: 15,
    lastUpdated: '2024-01-20',
    tags: ['microcontroller', 'prototyping', 'beginner']
  },
  {
    id: '2',
    name: 'Bambu Lab A1 Mini 3D Printer',
    category: '3D Printing',
    description: 'Compact 3D printer with automatic bed leveling and enclosed design.',
    sku: '3DP-BAM-001',
    location: '3D Printing Area - Station 2',
    status: 'checked-out',
    quantity: 0,
    totalQuantity: 1,
    lastUpdated: '2024-01-25',
    checkedOutBy: 'Alex Chen',
    dueDate: '2024-01-30',
    tags: ['3d-printer', 'enclosed', 'automatic']
  },
  {
    id: '3',
    name: 'Digital Oscilloscope',
    category: 'Test Equipment',
    description: 'Rigol DS1054Z 4-channel digital storage oscilloscope, 50MHz bandwidth.',
    sku: 'TST-OSC-001',
    location: 'Electronics Lab - Bench 3',
    status: 'available',
    quantity: 2,
    totalQuantity: 2,
    lastUpdated: '2024-01-22',
    tags: ['oscilloscope', 'measurement', 'professional']
  },
  {
    id: '4',
    name: 'Soldering Iron Station',
    category: 'Electronics',
    description: 'Temperature-controlled soldering station with precision tip.',
    sku: 'ELC-SOL-001',
    location: 'Electronics Lab - Workbench',
    status: 'maintenance',
    quantity: 0,
    totalQuantity: 6,
    lastUpdated: '2024-01-18',
    tags: ['soldering', 'temperature-control', 'precision']
  },
  {
    id: '5',
    name: 'CNC End Mill Set',
    category: 'Machining',
    description: 'High-speed steel end mill set for CNC machining operations.',
    sku: 'CNC-MIL-001',
    location: 'Machine Shop - Tool Cabinet B',
    status: 'available',
    quantity: 8,
    totalQuantity: 10,
    lastUpdated: '2024-01-24',
    tags: ['cnc', 'milling', 'cutting-tools']
  },
  {
    id: '6',
    name: 'Raspberry Pi 4B',
    category: 'Electronics',
    description: 'Single-board computer with ARM Cortex-A72 quad-core processor.',
    sku: 'RPI-4B-001',
    location: 'Electronics Lab - Storage Drawer',
    status: 'reserved',
    quantity: 3,
    totalQuantity: 8,
    lastUpdated: '2024-01-26',
    tags: ['raspberry-pi', 'computer', 'iot']
  }
];

const categories = ['All', 'Electronics', '3D Printing', 'Test Equipment', 'Machining', 'Woodworking', 'Safety'];
const statuses = ['All', 'available', 'checked-out', 'maintenance', 'reserved'];

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'available':
        return {
          icon: CheckCircle,
          color: 'text-primary',
          bgColor: 'bg-primary/20',
          borderColor: 'border-primary/30',
          label: 'Available'
        };
      case 'checked-out':
        return {
          icon: User,
          color: 'text-secondary-foreground',
          bgColor: 'bg-secondary/20',
          borderColor: 'border-secondary/30',
          label: 'Checked Out'
        };
      case 'maintenance':
        return {
          icon: Settings,
          color: 'text-destructive',
          bgColor: 'bg-destructive/20',
          borderColor: 'border-destructive/30',
          label: 'Maintenance'
        };
      case 'reserved':
        return {
          icon: Clock,
          color: 'text-accent-foreground',
          bgColor: 'bg-accent/20',
          borderColor: 'border-accent/30',
          label: 'Reserved'
        };
      default:
        return {
          icon: Package,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/20',
          borderColor: 'border-muted/30',
          label: status
        };
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    return (
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (selectedStatus === 'All' || item.status === selectedStatus) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  const handleCheckout = (item: InventoryItem) => {
    setSelectedItem(item);
    setCheckoutDialogOpen(true);
  };

  const totalItems = inventoryItems.reduce((sum, item) => sum + item.totalQuantity, 0);
  const availableItems = inventoryItems.filter(item => item.status === 'available').length;
  const checkedOutItems = inventoryItems.filter(item => item.status === 'checked-out').length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Equipment Inventory"
          subtitle="Access our comprehensive inventory of tools, equipment, and components. Check availability and reserve items for your projects."
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Equipment
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/60 px-8 py-4"
          >
            <Scan className="w-5 h-5 mr-2" />
            Scan QR Code
          </Button>
        </PageHeader>

        {/* Stats Bar */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center animate-fade-in">
                <div className="text-2xl font-bold text-primary mb-1">{totalItems}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="text-2xl font-bold text-primary mb-1">{availableItems}</div>
                <div className="text-sm text-muted-foreground">Available Now</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl font-bold text-primary mb-1">{checkedOutItems}</div>
                <div className="text-sm text-muted-foreground">Checked Out</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="text-2xl font-bold text-primary mb-1">8</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="glass p-6 mb-8 animate-slide-in-up">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, SKU, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-lift"
                >
                  <ScanLine className="w-4 h-4 mr-2" />
                  Scan QR
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="hover-lift"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="hover-lift"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 bg-background/50 border border-border/50 text-foreground focus:border-primary/50 focus:outline-none text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 bg-background/50 border border-border/50 text-foreground focus:border-primary/50 focus:outline-none text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => {
                const statusInfo = getStatusInfo(item.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <Card 
                    key={item.id} 
                    className="group bg-card/50 border-border/50 hover-lift overflow-hidden animate-slide-in-up"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge className={`text-xs ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {item.name}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground font-mono">
                        SKU: {item.sku}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Package className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {item.quantity} of {item.totalQuantity} available
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {item.status === 'available' && (
                        <Button
                          size="sm"
                          className="w-full hover-lift"
                          onClick={() => handleCheckout(item)}
                        >
                          Checkout Item
                        </Button>
                      )}
                      
                      {item.status === 'checked-out' && item.checkedOutBy && (
                        <div className="text-xs text-muted-foreground text-center">
                          Checked out by {item.checkedOutBy}
                          {item.dueDate && (
                            <div>Due: {new Date(item.dueDate).toLocaleDateString()}</div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="glass p-0 overflow-hidden animate-slide-in-up">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-secondary">
                    <tr>
                      <th className="text-left p-4 font-semibold">Item</th>
                      <th className="text-left p-4 font-semibold">SKU</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Quantity</th>
                      <th className="text-left p-4 font-semibold">Location</th>
                      <th className="text-left p-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const statusInfo = getStatusInfo(item.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={item.id} className="border-b border-border/30 hover:bg-background/50">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.category}</div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-sm">{item.sku}</td>
                          <td className="p-4">
                            <Badge className={`text-xs ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm">{item.quantity}/{item.totalQuantity}</td>
                          <td className="p-4 text-sm">{item.location}</td>
                          <td className="p-4">
                            {item.status === 'available' && (
                              <Button
                                size="sm"
                                onClick={() => handleCheckout(item)}
                                className="hover-lift"
                              >
                                Checkout
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-16 animate-slide-in-up">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Checkout Dialog */}
        <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Checkout Item</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="p-4 bg-background/50 border border-border/50">
                  <h4 className="font-semibold">{selectedItem.name}</h4>
                  <p className="text-sm text-muted-foreground">SKU: {selectedItem.sku}</p>
                  <p className="text-sm text-muted-foreground">{selectedItem.location}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="return-date">Expected Return Date</Label>
                    <Input
                      id="return-date"
                      type="date"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal-project">Personal Project</SelectItem>
                        <SelectItem value="class-assignment">Class Assignment</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes about your checkout..."
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setCheckoutDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="hover-lift">
                    Confirm Checkout
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}