# Medicine Tracker Example

A comprehensive example application built with AnuKit components, showcasing how to build a beautiful, production-ready medicine tracking application with plastic/glassmorphism UI and smooth animations.

## Features

### 🔐 Authentication
- **Login/Signup System**: Complete user authentication flow
- **Form Validation**: Real-time validation with helpful error messages
- **Persistent Sessions**: User data saved in localStorage

### 💊 Medicine Management
- **Add Medicines**: Create medicine entries with name, description, and purchase date
- **View History**: Browse all your medicines in a beautiful card layout
- **Search**: Real-time search through medicine names and descriptions
- **Delete**: Remove medicines from your history
- **Date Tracking**: Track when each medicine was purchased and added

### 🎨 UI/UX Features
- **Plastic/Glassmorphism Design**: Modern, beautiful UI with backdrop blur effects
- **Smooth Animations**: Fade-in, slide-in, and hover animations throughout
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Gradient Accents**: Eye-catching gradients and color schemes
- **Accessibility**: Built with keyboard navigation and screen reader support

## Components Used

This example demonstrates the following AnuKit components:

- `Button` - Various variants and sizes with animations
- `Input` - Form inputs with validation and error states
- `Textarea` - Multi-line text input for descriptions
- `Modal` - Auth and add medicine dialogs
- `Card` - Medicine display cards with glassmorphism
- `Badge` - Count indicators
- `Avatar` - User profile display
- `DatePicker` - Date selection for purchase dates
- `List`, `ListItem`, `ListItemText` - Structured data display

## Running the Example

### Option 1: View the Component Code

Open `MedicineTracker.tsx` to see the complete implementation. This file contains:
- Full TypeScript React component
- State management with hooks
- Form validation logic
- LocalStorage integration
- Beautiful UI with Tailwind CSS classes

### Option 2: Integrate into Your App

Copy the `MedicineTracker.tsx` component into your React application:

```tsx
import MedicineTracker from './examples/MedicineTracker';
import '@anukit/styles/dist/index.css';

function App() {
  return <MedicineTracker />;
}
```

### Option 3: Run in Playground

1. Build the AnuKit packages:
   ```bash
   pnpm install
   pnpm build:packages
   ```

2. Copy the component to the playground:
   ```bash
   cp examples/MedicineTracker.tsx apps/playground/src/components/
   ```

3. Import and use in playground:
   ```tsx
   // In apps/playground/src/App.tsx
   import MedicineTracker from './components/MedicineTracker';
   
   <MedicineTracker />
   ```

4. Run the playground:
   ```bash
   pnpm dev:playground
   ```

## Code Highlights

### State Management
```tsx
// Auth state
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [currentUser, setCurrentUser] = useState<User | null>(null);

// Medicine state
const [medicines, setMedicines] = useState<Medicine[]>([]);
const [searchQuery, setSearchQuery] = useState('');
```

### Form Validation
```tsx
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
```

### LocalStorage Persistence
```tsx
// Load data on mount
useEffect(() => {
  const savedUser = localStorage.getItem('medicineTracker_user');
  const savedMedicines = localStorage.getItem('medicineTracker_medicines');
  
  if (savedUser) {
    setCurrentUser(JSON.parse(savedUser));
    setIsLoggedIn(true);
  }
  
  if (savedMedicines) {
    const parsed = JSON.parse(savedMedicines);
    const medicinesWithDates = parsed.map((m: any) => ({
      ...m,
      purchaseDate: new Date(m.purchaseDate),
      createdAt: new Date(m.createdAt),
    }));
    setMedicines(medicinesWithDates);
  }
}, []);

// Save on changes
useEffect(() => {
  if (medicines.length > 0) {
    localStorage.setItem('medicineTracker_medicines', JSON.stringify(medicines));
  }
}, [medicines]);
```

### Search Functionality
```tsx
const filteredMedicines = medicines.filter(medicine =>
  medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
);
```

## UI Design Patterns

### Glassmorphism Cards
```tsx
<Card className="bg-white/80 backdrop-blur-sm border border-white/20 
               hover:shadow-xl transition-all duration-300 
               transform hover:-translate-y-1">
```

### Gradient Backgrounds
```tsx
<div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
```

### Animated Elements
```tsx
<Card
  style={{
    animationDelay: `${index * 50}ms`,
    animation: 'slideIn 0.3s ease-out forwards',
  }}
>
```

### Interactive Buttons
```tsx
<Button
  variant="primary"
  size="lg"
  onClick={handleAction}
  className="hover:scale-105 transition-transform"
>
```

## Learning Points

1. **Component Composition**: See how multiple AnuKit components work together
2. **State Management**: Learn React hooks patterns for complex state
3. **Form Handling**: Understand validation and error handling
4. **Data Persistence**: See localStorage integration patterns
5. **Responsive Design**: Study mobile-first responsive layouts
6. **Animations**: Learn CSS animations and transitions
7. **TypeScript**: See proper typing for React components
8. **Accessibility**: Understand accessible component usage

## Customization

### Change Color Scheme
Modify the gradient classes:
```tsx
// From blue-purple to your preferred colors
className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50"
```

### Add New Fields
Extend the `Medicine` interface:
```tsx
interface Medicine {
  id: string;
  name: string;
  description: string;
  purchaseDate: Date;
  createdAt: Date;
  // Add new fields
  dosage?: string;
  frequency?: string;
  expiryDate?: Date;
}
```

### Style Variations
Change the plastic/glass effect:
```tsx
// More transparent
className="bg-white/60 backdrop-blur-lg"

// More solid
className="bg-white/95 backdrop-blur-sm"
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Note: Backdrop blur effects require modern browser support.

## License

This example is part of the AnuKit library and follows the same license.

## Questions?

If you have questions about this example or want to suggest improvements, please open an issue on the AnuKit repository.
