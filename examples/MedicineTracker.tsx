import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  Card,
  List,
  ListItem,
  ListItemText,
  Badge,
  Textarea,
  DatePicker,
  Avatar,
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
 * Medicine Tracker - A comprehensive example using AnuKit components
 * Features: Login/Signup, Add Medicine, Search, Beautiful Plastic UI with animations
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
      const medicinesWithDates = parsed.map((m: any) => ({
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
        errors.email = 'Invalid email address';
      }
    }
    
    if (!authForm.password || authForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setAuthErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login/signup
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
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

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('medicineTracker_user');
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

  // Add medicine
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMedicineForm()) return;
    
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: medicineForm.name,
      description: medicineForm.description,
      purchaseDate: medicineForm.purchaseDate,
      createdAt: new Date(),
    };
    
    setMedicines([newMedicine, ...medicines]);
    setShowAddModal(false);
    setMedicineForm({ name: '', description: '', purchaseDate: new Date() });
    setMedicineErrors({});
  };

  // Delete medicine
  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  // Filter medicines by search query
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl font-bold">💊</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Medicine Tracker
              </h1>
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar
                    size="sm"
                    alt={currentUser?.username || 'User'}
                  >
                    {currentUser?.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="text-gray-700 font-medium hidden sm:inline">
                    {currentUser?.username}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:scale-105 transition-transform"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  setIsSignup(false);
                  setShowAuthModal(true);
                }}
                className="hover:scale-105 transition-transform"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLoggedIn ? (
          // Welcome screen
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center space-y-6 max-w-2xl">
              <div className="inline-block p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span className="text-8xl">💊</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Welcome to Medicine Tracker
              </h2>
              <p className="text-lg text-gray-600">
                Keep track of all your medicines, their descriptions, and purchase dates.
                Search through your medicine history with ease.
              </p>
              <div className="flex space-x-4 justify-center pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setIsSignup(false);
                    setShowAuthModal(true);
                  }}
                  className="hover:scale-105 transition-transform"
                >
                  Login
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setIsSignup(true);
                    setShowAuthModal(true);
                  }}
                  className="hover:scale-105 transition-transform"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Logged in view
          <div className="space-y-6">
            {/* Search and Add Medicine Bar */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 transform hover:shadow-2xl transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="🔍 Search medicines by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="lg"
                    className="w-full"
                  />
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowAddModal(true)}
                  className="hover:scale-105 transition-transform whitespace-nowrap"
                >
                  + Add Medicine
                </Button>
              </div>
            </div>

            {/* Medicine Count Badge */}
            <div className="flex items-center space-x-2">
              <Badge variant="solid" color="primary">
                {filteredMedicines.length} {filteredMedicines.length === 1 ? 'Medicine' : 'Medicines'}
              </Badge>
              {searchQuery && (
                <span className="text-sm text-gray-600">
                  (filtered from {medicines.length} total)
                </span>
              )}
            </div>

            {/* Medicine List */}
            {filteredMedicines.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 transform hover:shadow-xl transition-shadow duration-300">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery ? 'No medicines found' : 'No medicines yet'}
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery
                      ? 'Try adjusting your search query'
                      : 'Click "Add Medicine" to get started'}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredMedicines.map((medicine, index) => (
                  <Card
                    key={medicine.id}
                    className="bg-white/80 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'slideIn 0.3s ease-out forwards',
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <span className="text-white text-2xl">💊</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {medicine.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Purchased on {formatDate(medicine.purchaseDate)}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed pl-15">
                            {medicine.description}
                          </p>
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-500 pl-15">
                            <span>Added {formatDate(medicine.createdAt)}</span>
                          </div>
                        </div>
                        
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          className="hover:scale-105 transition-transform"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthForm({ username: '', email: '', password: '' });
          setAuthErrors({});
        }}
        title={isSignup ? 'Create Account' : 'Welcome Back'}
        size="md"
      >
        <form onSubmit={handleAuth} className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter your username"
            value={authForm.username}
            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
            error={authErrors.username}
            required
          />
          
          {isSignup && (
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              error={authErrors.email}
              required
            />
          )}
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            error={authErrors.password}
            helperText="Minimum 6 characters"
            required
          />
          
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthForm({ username: '', email: '', password: '' });
                  setAuthErrors({});
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {isSignup ? 'Sign Up' : 'Login'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Add Medicine Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setMedicineForm({ name: '', description: '', purchaseDate: new Date() });
          setMedicineErrors({});
        }}
        title="Add New Medicine"
        size="md"
      >
        <form onSubmit={handleAddMedicine} className="space-y-4">
          <Input
            label="Medicine Name"
            placeholder="e.g., Aspirin, Vitamin C"
            value={medicineForm.name}
            onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
            error={medicineErrors.name}
            required
          />
          
          <Textarea
            label="Description"
            placeholder="Enter medicine details, dosage, purpose, etc."
            value={medicineForm.description}
            onChange={(e) => setMedicineForm({ ...medicineForm, description: e.target.value })}
            error={medicineErrors.description}
            rows={4}
            required
          />
          
          <DatePicker
            label="Purchase Date"
            value={medicineForm.purchaseDate}
            onChange={(date) => date && setMedicineForm({ ...medicineForm, purchaseDate: date })}
            maxDate={new Date()}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setMedicineForm({ name: '', description: '', purchaseDate: new Date() });
                setMedicineErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Medicine
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MedicineTracker;
