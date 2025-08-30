import { Package, AlertCircle } from 'lucide-react';

const currentCheckouts = [
  {
    id: '1',
    item: 'Arduino Uno Kit',
    sku: 'ARD-UNO-001',
    checkedOut: '2 days ago',
    dueDate: 'Tomorrow',
    status: 'due-soon'
  },
  {
    id: '2',
    item: 'Soldering Iron',
    sku: 'SOL-IR-024', 
    checkedOut: '5 days ago',
    dueDate: 'In 2 days',
    status: 'active'
  },
  {
    id: '3',
    item: 'Oscilloscope',
    sku: 'OSC-DIG-003',
    checkedOut: '1 day ago',
    dueDate: 'In 6 days',
    status: 'active'
  }
];

export function CurrentCheckouts() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Active Checkouts</h3>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View All →
        </button>
      </div>
      
      <div className="space-y-3">
        {currentCheckouts.map((checkout, index) => (
          <div 
            key={checkout.id} 
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              checkout.status === 'due-soon' 
                ? 'text-destructive bg-destructive/10' 
                : 'text-primary bg-primary/10'
            }`}>
              {checkout.status === 'due-soon' ? (
                <AlertCircle className="h-6 w-6" />
              ) : (
                <Package className="h-6 w-6 group-hover:scale-110 transition-transform" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {checkout.item}
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {checkout.sku}
              </p>
              <p className="text-sm text-muted-foreground">
                Due: {checkout.dueDate}
              </p>
            </div>
            
            {checkout.status === 'due-soon' && (
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}