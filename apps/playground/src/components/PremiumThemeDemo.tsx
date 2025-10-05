import React, { useState, useEffect } from 'react';
import { Button, TextField, Textarea } from '@anukit/components';

// Add custom styles for form field spacing
const formFieldStyles = `
  .form-field {
    margin-bottom: 1.5rem;
  }
  .form-field .anukit-textfield-label,
  .form-field .anukit-label {
    margin-bottom: 0.5rem !important;
    display: block !important;
  }
  .form-actions {
    margin-top: 2rem;
  }
`;

type Theme = {
  name: string;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    primary: string;
    primaryHover: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
  };
};

const themes: Record<string, Theme> = {
  'default-light': {
    name: 'Default Light',
    colors: {
      background: '#ffffff',
      surface: '#ffffff',
      surfaceHover: '#fafafa',
      primary: '#1890ff',
      primaryHover: '#40a9ff',
      text: '#000000d9',
      textSecondary: '#00000073',
      border: '#d9d9d9',
      shadow: 'rgba(0, 0, 0, 0.02)'
    }
  },
  'default-dark': {
    name: 'Default Dark',
    colors: {
      background: '#141414',
      surface: '#1f1f1f',
      surfaceHover: '#262626',
      primary: '#1890ff',
      primaryHover: '#40a9ff',
      text: '#ffffffd9',
      textSecondary: '#ffffff73',
      border: '#303030',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  }
};

const PremiumThemeDemo: React.FC = () => {
  const [userTheme, setUserTheme] = useState<keyof typeof themes | 'system'>('system');
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('default-light');

  useEffect(() => {
    if (userTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setCurrentTheme(mediaQuery.matches ? 'default-dark' : 'default-light');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'default-dark' : 'default-light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setCurrentTheme(userTheme);
    }
  }, [userTheme]);

  const handleThemeChange = (theme: keyof typeof themes | 'system') => {
    setUserTheme(theme);
  };

  const theme = themes[currentTheme];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: formFieldStyles }} />
      <div
        className="min-h-screen transition-all duration-300"
        style={{
          background: theme.colors.background,
          color: theme.colors.text,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: '16px',
          lineHeight: '1.6'
        }}
    >
      {/* Navigation Header */}
      <nav 
        className="sticky top-0 z-50 backdrop-blur-sm border-b"
        style={{
          background: theme.colors.surface,
          borderColor: theme.colors.border,
          boxShadow: `0 1px 3px ${theme.colors.shadow}`
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold" style={{ color: theme.colors.text }}>
                AnuKit Premium
              </h1>
              <div className="hidden md:flex space-x-6">
                {['Components', 'Documentation', 'Examples', 'Blog'].map((item) => (
                  <a 
                    key={item}
                    href="#" 
                    className="text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {['default-light', 'default-dark'].map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeChange(themeKey as keyof typeof themes)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{
                    background: currentTheme === themeKey ? theme.colors.primary : 'transparent',
                    color: currentTheme === themeKey ? '#ffffff' : theme.colors.textSecondary,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  {themeKey === 'default-light' ? '☀️' : '🌙'}
                </button>
              ))}
              <button
                onClick={() => handleThemeChange('system')}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  background: userTheme === 'system' ? theme.colors.primary : 'transparent',
                  color: userTheme === 'system' ? '#ffffff' : theme.colors.textSecondary,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                🖥️
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6" style={{ color: theme.colors.text }}>
            Premium Component Library
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: theme.colors.textSecondary }}>
            Build beautiful, accessible React applications with our modern design system
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              View Components
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: theme.colors.text }}>
            Why Choose AnuKit?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Beautiful Design', description: 'Modern, clean components with premium aesthetics' },
              { icon: '♿', title: 'Accessible', description: 'Built with accessibility in mind from the ground up' },
              { icon: '📱', title: 'Responsive', description: 'Works perfectly on all devices and screen sizes' },
              { icon: '🚀', title: 'Performance', description: 'Optimized for speed with minimal bundle size' },
              { icon: '🔧', title: 'Customizable', description: 'Easy to theme and customize for your brand' },
              { icon: '📖', title: 'Well Documented', description: 'Comprehensive docs with live examples' }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: `0 4px 12px ${theme.colors.shadow}`
                }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2" style={{ color: theme.colors.text }}>
                  {feature.title}
                </h4>
                <p style={{ color: theme.colors.textSecondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: theme.colors.text }}>
            Component Preview
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form Example */}
            <div
              className="p-8 rounded-xl"
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: `0 4px 12px ${theme.colors.shadow}`
              }}
            >
              <h4 className="text-xl font-semibold mb-6" style={{ color: theme.colors.text }}>
                Premium Form
              </h4>
              <form className="space-y-6">
                <div className="form-field">
                  <TextField
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    size="md"
                    fullWidth
                  />
                </div>
                <div className="form-field">
                  <Textarea
                    label="Message"
                    placeholder="Your message..."
                    rows={4}
                    size="md"
                    fullWidth
                  />
                </div>
                <div className="form-actions pt-2">
                  <Button className="w-full">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Stats Card */}
            <div
              className="p-8 rounded-xl"
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: `0 4px 12px ${theme.colors.shadow}`
              }}
            >
              <h4 className="text-xl font-semibold mb-6" style={{ color: theme.colors.text }}>
                Analytics Dashboard
              </h4>
              <div className="space-y-6">
                {[
                  { label: 'Total Users', value: '12,543', change: '+12%' },
                  { label: 'Revenue', value: '$45,678', change: '+23%' },
                  { label: 'Conversion', value: '3.2%', change: '+0.8%' }
                ].map((stat, index) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold" style={{ color: theme.colors.text }}>
                        {stat.value}
                      </p>
                    </div>
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e'
                      }}
                    >
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Components Showcase */}
      <section className="py-16" style={{ background: currentTheme === 'default-dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: theme.colors.text }}>
            Form Components
          </h3>
          <div className="max-w-2xl mx-auto">
            <div
              className="p-8 rounded-xl"
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: `0 4px 12px ${theme.colors.shadow}`
              }}
            >
              <h4 className="text-xl font-semibold mb-6" style={{ color: theme.colors.text }}>
                Ant Design Style Form Controls
              </h4>
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-field">
                    <TextField
                      label="First Name"
                      placeholder="Enter first name"
                      size="md"
                      fullWidth
                    />
                  </div>
                  <div className="form-field">
                    <TextField
                      label="Last Name"
                      placeholder="Enter last name"
                      size="md"
                      fullWidth
                    />
                  </div>
                </div>
                
                <div className="form-field">
                  <TextField
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    size="md"
                    fullWidth
                  />
                </div>
                
                <div className="form-field">
                  <TextField
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    size="md"
                    fullWidth
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="form-field">
                    <TextField
                      label="Small Input"
                      placeholder="Small size"
                      size="sm"
                      fullWidth
                    />
                  </div>
                  <div className="form-field">
                    <TextField
                      label="Medium Input"
                      placeholder="Medium size"
                      size="md"
                      fullWidth
                    />
                  </div>
                  <div className="form-field">
                    <TextField
                      label="Large Input"
                      placeholder="Large size"
                      size="lg"
                      fullWidth
                    />
                  </div>
                </div>
                
                <div className="form-field">
                  <Textarea
                    label="Message"
                    placeholder="Enter your message here..."
                    size="md"
                    rows={4}
                    fullWidth
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-field">
                    <TextField
                      label="Error State"
                      placeholder="This field has an error"
                      variant="error"
                      error="This field is required"
                      size="md"
                      fullWidth
                    />
                  </div>
                  <div className="form-field">
                    <TextField
                      label="Success State"
                      placeholder="This field is valid"
                      variant="success"
                      helperText="Looks good!"
                      size="md"
                      fullWidth
                    />
                  </div>
                </div>
                
                <div className="form-actions flex gap-4 pt-4">
                  <Button variant="primary" size="md">Submit</Button>
                  <Button variant="secondary" size="md">Cancel</Button>
                  <Button variant="ghost" size="md">Reset</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default PremiumThemeDemo;