import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  DatePicker,
  Input,
  List,
  ListItem,
  ListItemText,
  Modal,
  Textarea,
} from '@anukit/components';

interface Medicine {
  id: string;
  name: string;
  description: string;
  purchaseDate: Date;
  createdAt: Date;
}

interface User {
  username: string;
  email: string;
}

/**
 * Medicine Tracker - AnuKit Design System Demo
 * Features: Login/Signup, Add Medicine, Search, Beautiful AnuKit UI
 */
export const MedicineTracker: React.FC = () => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  
  // Auth form state
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [authErrors, setAuthErrors] = useState<Record<string, string>>({});

  // Medicine state
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Medicine form state
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    description: '',
    purchaseDate: new Date(),
  });
  const [medicineErrors, setMedicineErrors] = useState<Record<string, string>>({});

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('medicineTracker_user');
    const savedMedicines = localStorage.getItem('medicineTracker_medicines');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    
    if (savedMedicines) {
      const parsed = JSON.parse(savedMedicines);
      // Convert date strings back to Date objects
      const medicinesWithDates = parsed.map((m: Medicine) => ({
        ...m,
        purchaseDate: new Date(m.purchaseDate),
        createdAt: new Date(m.createdAt),
      }));
      setMedicines(medicinesWithDates);
    }
  }, []);

  // Save medicines to localStorage
  useEffect(() => {
    if (medicines.length > 0) {
      localStorage.setItem('medicineTracker_medicines', JSON.stringify(medicines));
    }
  }, [medicines]);

  // Auth validation
  const validateAuthForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!authForm.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (isSignup) {
      if (!authForm.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(authForm.email)) {
        errors.email = 'Please enter a valid email';
      }
    }
    
    if (!authForm.password.trim()) {
      errors.password = 'Password is required';
    } else if (authForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setAuthErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Medicine validation
  const validateMedicineForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!medicineForm.name.trim()) {
      errors.name = 'Medicine name is required';
    }
    
    if (!medicineForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    setMedicineErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Auth handlers
  const handleAuth = (): void => {
    if (!validateAuthForm()) return;
    
    const user: User = {
      username: authForm.username,
      email: authForm.email || `${authForm.username}@example.com`,
    };
    
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('medicineTracker_user', JSON.stringify(user));
    setShowAuthModal(false);
    setAuthForm({ username: '', email: '', password: '' });
    setAuthErrors({});
  };

  const handleLogout = (): void => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('medicineTracker_user');
  };

  // Medicine handlers
  const handleAddMedicine = (): void => {
    if (!validateMedicineForm()) return;
    
    const newMedicine: Medicine = {
      id: Math.random().toString(36).substr(2, 9),
      name: medicineForm.name,
      description: medicineForm.description,
      purchaseDate: medicineForm.purchaseDate,
      createdAt: new Date(),
    };
    
    setMedicines(prev => [newMedicine, ...prev]);
    setShowAddModal(false);
    setMedicineForm({
      name: '',
      description: '',
      purchaseDate: new Date(),
    });
    setMedicineErrors({});
  };

  const handleDeleteMedicine = (id: string): void => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  // Filter medicines based on search
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Landing page for non-authenticated users
  if (!isLoggedIn) {
    return (
      <div className="medicine-tracker-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Hero Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="medicine-tracker-hero-icon">
              <span className="text-white text-2xl font-bold">💊</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Medicine Tracker
            </h1>
            <p className="text-secondary">
              Keep track of your medicines with ease
            </p>
          </div>

          {/* Auth Card */}
          <Card className="medicine-tracker-card border-0">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-primary mb-6 text-center">
                Welcome Back
              </h2>
              
              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setIsSignup(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setIsSignup(true);
                    setShowAuthModal(true);
                  }}
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </Card>

          {/* Demo Features */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="medicine-tracker-feature-card">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-primary">Easy Tracking</h3>
              <p className="text-sm text-secondary">Add and manage your medicines</p>
            </div>
            <div className="medicine-tracker-feature-card">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold text-primary">Smart Search</h3>
              <p className="text-sm text-secondary">Find medicines quickly</p>
            </div>
            <div className="medicine-tracker-feature-card">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-primary">Purchase History</h3>
              <p className="text-sm text-secondary">Track purchase dates</p>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <Modal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            setAuthForm({ username: '', email: '', password: '' });
            setAuthErrors({});
          }}
          title={isSignup ? 'Create Account' : 'Sign In'}
        >
          <div className="space-y-4">
            <Input
              label="Username"
              value={authForm.username}
              onChange={(e) => setAuthForm(prev => ({ ...prev, username: e.target.value }))}
              error={authErrors.username}
              placeholder="Enter your username"
            />
            
            {isSignup && (
              <Input
                label="Email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                error={authErrors.email}
                placeholder="Enter your email"
              />
            )}
            
            <Input
              label="Password"
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
              error={authErrors.password}
              placeholder="Enter your password"
            />
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthForm({ username: '', email: '', password: '' });
                  setAuthErrors({});
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAuth}
                className="flex-1"
              >
                {isSignup ? 'Create Account' : 'Sign In'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Main dashboard for authenticated users
  return (
    <div className="medicine-tracker-bg">
      {/* Header */}
      <header className="medicine-tracker-header">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="medicine-tracker-hero-icon w-10 h-10">
                <span className="text-white text-lg font-bold">💊</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Medicine Tracker</h1>
                <p className="text-sm text-secondary">Welcome back, {currentUser?.username}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar name={currentUser?.username || ''} size="sm" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="medicine-tracker-stat-card-blue border-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Medicines</p>
                  <p className="text-3xl font-bold">{medicines.length}</p>
                </div>
                <div className="text-4xl opacity-80">💊</div>
              </div>
            </div>
          </Card>
          
          <Card className="medicine-tracker-stat-card-green border-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">This Month</p>
                  <p className="text-3xl font-bold">
                    {medicines.filter(m => {
                      const now = new Date();
                      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                      return m.purchaseDate >= monthStart;
                    }).length}
                  </p>
                </div>
                <div className="text-4xl opacity-80">📅</div>
              </div>
            </div>
          </Card>
          
          <Card className="medicine-tracker-stat-card-purple border-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Recent</p>
                  <p className="text-3xl font-bold">
                    {medicines.filter(m => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return m.purchaseDate >= weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="text-4xl opacity-80">⏰</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="medicine-tracker-card"
            />
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Medicine
          </Button>
        </div>

        {/* Medicine List */}
        <Card className="medicine-tracker-card border-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">
                Your Medicines
                {searchQuery && (
                  <Badge variant="soft" className="ml-2">
                    {filteredMedicines.length} found
                  </Badge>
                )}
              </h2>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {searchQuery ? 'No medicines found' : 'No medicines yet'}
                </h3>
                <p className="text-secondary mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Start by adding your first medicine'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Your First Medicine
                  </Button>
                )}
              </div>
            ) : (
              <List className="space-y-3">
                {filteredMedicines.map((medicine) => (
                  <ListItem
                    key={medicine.id}
                    className="medicine-tracker-medicine-item p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <ListItemText
                          primary={medicine.name}
                          secondary={medicine.description}
                          className="mb-3"
                        />
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            📅 {medicine.purchaseDate.toLocaleDateString()}
                          </Badge>
                          <Badge variant="soft" className="text-xs">
                            Added {medicine.createdAt.toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="ml-4 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </Button>
                    </div>
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        </Card>
      </main>

      {/* Add Medicine Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setMedicineForm({
            name: '',
            description: '',
            purchaseDate: new Date(),
          });
          setMedicineErrors({});
        }}
        title="Add New Medicine"
      >
        <div className="space-y-4">
          <Input
            label="Medicine Name"
            value={medicineForm.name}
            onChange={(e) => setMedicineForm(prev => ({ ...prev, name: e.target.value }))}
            error={medicineErrors.name}
            placeholder="e.g., Aspirin, Vitamin D"
          />
          
          <Textarea
            label="Description"
            value={medicineForm.description}
            onChange={(e) => setMedicineForm(prev => ({ ...prev, description: e.target.value }))}
            error={medicineErrors.description}
            placeholder="Describe the medicine, dosage, or purpose..."
            rows={3}
          />
          
          <DatePicker
            label="Purchase Date"
            value={medicineForm.purchaseDate}
            onChange={(date) => setMedicineForm(prev => ({ ...prev, purchaseDate: date || new Date() }))}
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddModal(false);
                setMedicineForm({
                  name: '',
                  description: '',
                  purchaseDate: new Date(),
                });
                setMedicineErrors({});
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddMedicine}
              className="flex-1"
            >
              Add Medicine
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MedicineTracker;