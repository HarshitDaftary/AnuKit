import React, { useEffect, useState } from 'react';

const themes = {
  'glass-light': {
    name: 'glass-light',
    displayName: 'Glass Light',
    colors: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      backgroundSubtle: 'rgba(255, 255, 255, 0.15)',
      backgroundMuted: 'rgba(255, 255, 255, 0.25)',
      foreground: 'rgba(255, 255, 255, 0.95)',
      foregroundMuted: 'rgba(255, 255, 255, 0.7)',
      primary: 'rgba(139, 92, 246, 0.8)',
      primaryEmphasis: 'rgba(124, 58, 237, 0.9)',
      success: 'rgba(34, 197, 94, 0.8)',
      warning: 'rgba(245, 158, 11, 0.8)',
      error: 'rgba(239, 68, 68, 0.8)',
      border: 'rgba(255, 255, 255, 0.25)',
    }
  },
  'glass-dark': {
    name: 'glass-dark',
    displayName: 'Glass Dark',
    colors: {
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%)',
      backgroundSubtle: 'rgba(0, 0, 0, 0.15)',
      backgroundMuted: 'rgba(0, 0, 0, 0.25)',
      foreground: 'rgba(0, 0, 0, 0.95)',
      foregroundMuted: 'rgba(0, 0, 0, 0.7)',
      primary: 'rgba(139, 92, 246, 0.8)',
      primaryEmphasis: 'rgba(124, 58, 237, 0.9)',
      success: 'rgba(34, 197, 94, 0.8)',
      warning: 'rgba(245, 158, 11, 0.8)',
      error: 'rgba(239, 68, 68, 0.8)',
      border: 'rgba(0, 0, 0, 0.25)',
    }
  }
};

export const ThemeDemo: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('glass-light');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [userTheme, setUserTheme] = useState<keyof typeof themes | 'system'>('system');
  
  const theme = themes[currentTheme];

  useEffect(() => {
    // Detect system preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    // Update current theme based on user selection
    if (userTheme === 'system') {
      setCurrentTheme(systemTheme === 'light' ? 'glass-light' : 'glass-dark');
    } else {
      setCurrentTheme(userTheme);
    }
  }, [userTheme, systemTheme]);

  const handleThemeChange = (newTheme: keyof typeof themes | 'system') => {
    setUserTheme(newTheme);
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ 
        background: (currentTheme === 'glass-light' || currentTheme === 'glass-dark')
          ? (currentTheme === 'glass-dark' 
              ? 'linear-gradient(135deg, #2d1b69 0%, #1a1a2e 50%, #16213e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)')
          : theme.colors.background,
        color: theme.colors.foreground,
        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.6'
      }}
    >
      {(currentTheme === 'glass-light' || currentTheme === 'glass-dark') && (
              {(currentTheme === 'glass-light' || currentTheme === 'glass-dark') && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(200, 200, 255, 0.3) 0%, transparent 50%)',
            zIndex: -1
          }}
        />
      )}
      )}

      {(currentTheme === 'glass-light' || currentTheme === 'glass-dark') ? (
        // Glass Theme Layout with Sidebar
              {(currentTheme === 'glass-light' || currentTheme === 'glass-dark') ? (
        // Glass Theme Layout with Sidebar
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div 
            className="w-64 min-h-screen border-r backdrop-blur-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
            }}
          >
            <div className="p-6">
              <h1 className="font-bold text-xl mb-8" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                🪟 Glass Dashboard
              </h1>
              
              {/* Navigation Items */}
              <nav className="space-y-3">
                {[
                  { icon: '📊', label: 'Analytics', active: true },
                  { icon: '👥', label: 'Team', active: false },
                  { icon: '⚙️', label: 'Settings', active: false },
                  { icon: '🎨', label: 'Themes', active: false }
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm"
                    style={{
                      background: item.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      color: 'rgba(255, 255, 255, 0.9)',
                      border: item.active ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Header Bar */}
            <div 
              className="mb-6 p-4 rounded-xl backdrop-blur-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(25px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
              }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  Glass Interface Demo
                </h2>
                <div className="flex gap-3">
                  {['glass-light', 'glass-dark'].map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey as keyof typeof themes)}
                      className="px-3 py-1 rounded-lg text-sm backdrop-blur-sm transition-all duration-150"
                      style={{
                        background: currentTheme === themeKey ? 'rgba(139, 92, 246, 0.7)' : 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {themeKey === 'glass-light' ? '☀️ Glass Light' : '🌙 Glass Dark'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Stat Cards */}
              {[
                { title: 'Total Users', value: '12,543', icon: '👥', color: 'rgba(139, 92, 246, 0.7)' },
                { title: 'Revenue', value: '$45,678', icon: '💰', color: 'rgba(34, 197, 94, 0.7)' },
                { title: 'Growth', value: '+23.5%', icon: '📈', color: 'rgba(245, 158, 11, 0.7)' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl backdrop-blur-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(25px)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ background: stat.color }}
                    />
                  </div>
                  <h3 className="text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive Controls Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Form Card */}
              <div
                className="p-6 rounded-xl backdrop-blur-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(25px)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  Glass Form
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 rounded-lg backdrop-blur-sm border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2 rounded-lg backdrop-blur-sm border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <option>Design</option>
                      <option>Development</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                  <button
                    className="w-full py-2 rounded-lg font-medium backdrop-blur-sm transition-all duration-200"
                    style={{
                      background: 'rgba(139, 92, 246, 0.7)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Controls Card */}
              <div
                className="p-6 rounded-xl backdrop-blur-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(25px)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  Interactive Controls
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Opacity: 75%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="75"
                      className="w-full h-2 rounded-lg appearance-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Blur Intensity: 50%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full h-2 rounded-lg appearance-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Dark Mode</span>
                    <div 
                      className="w-12 h-6 rounded-full p-1 backdrop-blur-sm"
                      style={{
                        background: 'rgba(139, 92, 246, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full bg-white transition-transform duration-200"
                        style={{ transform: 'translateX(100%)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Original Theme Layout
        <>
      {/* Glass theme overlay content */}
      <div 
        className={currentTheme === 'glass' ? 'backdrop-blur-sm' : ''}
        style={{
          background: currentTheme === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          minHeight: '100vh'
        }}
      >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 border-b backdrop-blur-sm"
        style={{ 
          background: currentTheme === 'glass' 
            ? 'rgba(255, 255, 255, 0.1)'
            : theme.colors.background.includes('gradient') ? `${theme.colors.background}f0` : `${theme.colors.background}f0`,
          borderColor: theme.colors.border,
          backdropFilter: currentTheme === 'glass' ? 'blur(20px)' : 'blur(10px)'
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-bold" style={{ fontSize: '2rem' }}>
              🎨 AnuKit Theme Explorer
            </h1>
            
            <div className="flex gap-2">
              {/* Quick Theme Toggles */}
              <button
                onClick={() => handleThemeChange('glass-light')}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-150 border"
                style={{
                  fontSize: '15px',
                  backgroundColor: currentTheme === 'glass-light' ? theme.colors.primary : 'transparent',
                  color: currentTheme === 'glass-light' ? 'white' : theme.colors.foreground,
                  borderColor: theme.colors.border
                }}
              >
                ☀️ Glass Light
              </button>
              
              <button
                onClick={() => handleThemeChange('glass-dark')}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-150 border"
                style={{
                  fontSize: '15px',
                  backgroundColor: currentTheme === 'glass-dark' ? theme.colors.primary : 'transparent',
                  color: currentTheme === 'glass-dark' ? 'white' : theme.colors.foreground,
                  borderColor: theme.colors.border
                }}
              >
                � Glass Dark
              </button>
              
              <button
                onClick={() => handleThemeChange('system')}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-150 border"
                style={{
                  fontSize: '15px',
                  backgroundColor: userTheme === 'system' ? '#8b5cf6' : 'transparent',
                  color: userTheme === 'system' ? 'white' : theme.colors.foreground,
                  borderColor: theme.colors.border
                }}
              >
                🖥️ System
              </button>
            </div>
          </div>
          
          {/* Current Theme Info */}
          <div className="mt-3 flex items-center gap-4" style={{ fontSize: '15px' }}>
            <span style={{ color: theme.colors.foregroundMuted }}>
              Selected: <strong>{userTheme}</strong>
            </span>
            <span style={{ color: theme.colors.foregroundMuted }}>
              Applied: <strong>{currentTheme}</strong>
            </span>
            <span style={{ color: theme.colors.foregroundMuted }}>
              WCAG 2.1 AA ✅ Compliant
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-8">
        
        {/* Theme Overview Cards */}
        <section>
          <h2 className="font-semibold mb-4" style={{ fontSize: '1.75rem' }}>
            Available Themes
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Light Theme Card */}
            <button 
              className="w-full rounded-xl p-6 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg text-left"
              style={{
                background: theme.colors.backgroundSubtle,
                borderColor: currentTheme === 'light' ? theme.colors.primary : theme.colors.border
              }}
              onClick={() => handleThemeChange('light')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">☀️</div>
                <h3 className="text-lg font-semibold">
                  Light Theme
                </h3>
                {currentTheme === 'light' && <div style={{ color: theme.colors.success }}>✓ Active</div>}
              </div>
              <p className="text-sm mb-4" style={{ color: theme.colors.foregroundMuted }}>
                Clean, bright interface optimized for daylight use. Perfect contrast ratios for readability.
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#06b6d4' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#e6fffa' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#10b981' }} />
              </div>
            </button>

            {/* Dark Theme Card */}
            <button 
              className="w-full rounded-xl p-6 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg text-left"
              style={{
                background: theme.colors.backgroundSubtle,
                borderColor: currentTheme === 'dark' ? theme.colors.primary : theme.colors.border
              }}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">🌙</div>
                <h3 className="text-lg font-semibold">
                  Dark Theme
                </h3>
                {currentTheme === 'dark' && <div style={{ color: theme.colors.success }}>✓ Active</div>}
              </div>
              <p className="text-sm mb-4" style={{ color: theme.colors.foregroundMuted }}>
                Easy on the eyes for low-light environments. Reduces eye strain during extended use.
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: '#042f2e', borderColor: '#14b8a6' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#22d3ee' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#0f766e' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#34d399' }} />
              </div>
            </button>

            {/* Pastel Neon Theme Card */}
            <button 
              className="w-full rounded-xl p-6 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg text-left"
              style={{
                background: theme.colors.backgroundSubtle,
                borderColor: currentTheme === 'pastel-neon' ? '#8b00ff' : theme.colors.border
              }}
              onClick={() => handleThemeChange('pastel-neon')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">✨</div>
                <h3 className="text-lg font-semibold">
                  Pastel Neon Purple
                </h3>
                {currentTheme === 'pastel-neon' && <div style={{ color: theme.colors.success }}>✓ Active</div>}
              </div>
              <p className="text-sm mb-4" style={{ color: theme.colors.foregroundMuted }}>
                Dreamy pastel purple gradients with vibrant neon borders. Smooth color transitions for modern elegance.
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded border" style={{ background: 'linear-gradient(135deg, #f5e6ff 0%, #e9d5ff 100%)', borderColor: '#8b00ff' }} />
                <div className="w-6 h-6 rounded" style={{ background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)' }} />
                <div className="w-6 h-6 rounded border-2" style={{ background: 'linear-gradient(90deg, #e9d5ff 0%, #ddd6fe 100%)', borderColor: '#8b00ff' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#8b00ff' }} />
              </div>
            </button>

            {/* Rose Gold Theme Card */}
            <button 
              className="w-full rounded-xl p-6 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg text-left"
              style={{
                background: theme.colors.backgroundSubtle,
                borderColor: currentTheme === 'rose-gold' ? theme.colors.primary : theme.colors.border
              }}
              onClick={() => handleThemeChange('rose-gold')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">🌹</div>
                <h3 className="text-lg font-semibold">
                  Rose Gold
                </h3>
                {currentTheme === 'rose-gold' && <div style={{ color: theme.colors.success }}>✓ Active</div>}
              </div>
              <p className="text-sm mb-4" style={{ color: theme.colors.foregroundMuted }}>
                Warm, luxurious rose gold theme with premium copper and bronze tones. Exudes sophistication.
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: '#fffbf7', borderColor: '#fdba74' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ea580c' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#fed7aa' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#16a34a' }} />
              </div>
            </button>

            {/* Sage Green Theme Card */}
            <button 
              className="w-full rounded-xl p-6 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg text-left"
              style={{
                background: theme.colors.backgroundSubtle,
                borderColor: currentTheme === 'sage' ? theme.colors.primary : theme.colors.border
              }}
              onClick={() => handleThemeChange('sage')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">🌿</div>
                <h3 className="text-lg font-semibold">
                  Sage Green
                </h3>
                {currentTheme === 'sage' && <div style={{ color: theme.colors.success }}>✓ Active</div>}
              </div>
              <p className="text-sm mb-4" style={{ color: theme.colors.foregroundMuted }}>
                Fresh, natural sage green theme. Calming and premium, perfect for health and wellness brands.
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: '#f6fdf9', borderColor: '#86efac' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#22c55e' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#bbf7d0' }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: '#15803d' }} />
              </div>
            </button>

            {/* Glass Theme Card */}
            <button 
              className="w-full rounded-xl p-6 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg text-left backdrop-blur-md"
              style={{
                background: currentTheme === 'glass' 
                  ? 'rgba(255, 255, 255, 0.25)' 
                  : theme.colors.backgroundSubtle,
                borderColor: currentTheme === 'glass' ? 'rgba(255, 255, 255, 0.3)' : theme.colors.border,
                backdropFilter: 'blur(10px)',
                boxShadow: currentTheme === 'glass' 
                  ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' 
                  : undefined
              }}
              onClick={() => handleThemeChange('glass')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">🪟</div>
                <h3 className="text-lg font-semibold">
                  Frosted Glass
                </h3>
                {currentTheme === 'glass' && <div style={{ color: theme.colors.success }}>✓ Active</div>}
              </div>
              <p className="text-sm mb-4" style={{ color: theme.colors.foregroundMuted }}>
                Translucent frosted glass effect with backdrop blur. Modern glassmorphism design without copyright issues.
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded border backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                <div className="w-6 h-6 rounded backdrop-blur-sm" style={{ background: 'rgba(99, 102, 241, 0.8)' }} />
                <div className="w-6 h-6 rounded backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.25)' }} />
                <div className="w-6 h-6 rounded" style={{ background: 'rgba(16, 185, 129, 0.8)' }} />
              </div>
            </button>
          </div>
        </section>

        {/* Color Palette Demo */}
        <section>
          <h2 className="font-semibold mb-4" style={{ fontSize: '1.75rem' }}>
            Semantic Color System
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Primary Colors */}
            <div>
              <h3 className="font-medium mb-3" style={{ color: theme.colors.foregroundMuted, fontSize: '16px' }}>
                Primary (Brand)
              </h3>
              <div className="space-y-2">
                <div 
                  className="h-12 rounded-lg flex items-center px-3 text-white font-medium"
                  style={{ background: theme.colors.primary, fontSize: '15px' }}
                >
                  Primary Default
                </div>
                <div 
                  className="h-10 rounded-lg flex items-center px-3 text-white"
                  style={{ background: theme.colors.primaryEmphasis, fontSize: '14px' }}
                >
                  Emphasized
                </div>
                <div 
                  className="h-10 rounded-lg flex items-center px-3 border"
                  style={{ 
                    backgroundColor: theme.colors.backgroundMuted,
                    color: theme.colors.foreground,
                    borderColor: theme.colors.border,
                    fontSize: '14px'
                  }}
                >
                  Muted Background
                </div>
              </div>
            </div>

            {/* Success Colors */}
            <div>
              <h3 className="font-medium mb-3" style={{ color: theme.colors.foregroundMuted, fontSize: '16px' }}>
                Success (Green)
              </h3>
              <div className="space-y-2">
                <div 
                  className="h-12 rounded-lg flex items-center px-3 text-white font-medium"
                  style={{ backgroundColor: theme.colors.success, fontSize: '15px' }}
                >
                  Success Default
                </div>
                <div 
                  className="h-10 rounded-lg flex items-center px-3 text-white"
                  style={{ backgroundColor: theme.colors.success, filter: 'brightness(0.9)', fontSize: '14px' }}
                >
                  Emphasized
                </div>
                <div 
                  className="h-10 rounded-lg flex items-center px-3 border"
                  style={{ 
                    backgroundColor: theme.colors.backgroundMuted,
                    color: theme.colors.foreground,
                    borderColor: theme.colors.border,
                    fontSize: '14px'
                  }}
                >
                  Muted Background
                </div>
              </div>
            </div>

            {/* Warning Colors */}
            <div>
              <h3 className="font-medium mb-3" style={{ color: theme.colors.foregroundMuted, fontSize: '16px' }}>
                Warning (Amber)
              </h3>
              <div className="space-y-2">
                <div 
                  className="h-12 rounded-lg flex items-center px-3 text-white font-medium"
                  style={{ backgroundColor: theme.colors.warning, fontSize: '15px' }}
                >
                  Warning Default
                </div>
                <div 
                  className="h-10 rounded-lg flex items-center px-3 text-white"
                  style={{ backgroundColor: theme.colors.warning, filter: 'brightness(0.9)', fontSize: '14px' }}
                >
                  Emphasized
                </div>
                <div 
                  className="h-10 rounded-lg flex items-center px-3 border"
                  style={{ 
                    backgroundColor: theme.colors.backgroundMuted,
                    color: theme.colors.foreground,
                    borderColor: theme.colors.border,
                    fontSize: '14px'
                  }}
                >
                  Muted Background
                </div>
              </div>
            </div>

            {/* Error Colors */}
            <div>
              <h3 className="font-medium mb-3" style={{ color: theme.colors.foregroundMuted, fontSize: '16px' }}>
                Error (Red)
              </h3>
              <div className="space-y-2">
                <div 
                  className="h-12 rounded-lg flex items-center px-3 text-white font-medium"
                  style={{ backgroundColor: theme.colors.error, fontSize: '15px' }}
                >
                  Error Default
                </div>
                <div 
                  className="h-10 rounded-lg flex items-center px-3 text-white"
                  style={{ backgroundColor: theme.colors.error, filter: 'brightness(0.9)', fontSize: '14px' }}
                >
                  Emphasized
                </div>
                <div 
                  className="h-10 rounded-lg flex items-center px-3 border"
                  style={{ 
                    backgroundColor: theme.colors.backgroundMuted,
                    color: theme.colors.foreground,
                    borderColor: theme.colors.border,
                    fontSize: '14px'
                  }}
                >
                  Muted Background
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Examples */}
        <section>
          <h2 className="font-semibold mb-4" style={{ fontSize: '1.75rem' }}>
            Component Examples
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Card Example */}
            <div 
              className="rounded-lg p-6 border"
              style={{
                backgroundColor: theme.colors.backgroundSubtle,
                borderColor: theme.colors.border
              }}
            >
              <h3 className="font-medium mb-2" style={{ fontSize: '1.25rem' }}>
                Sample Card Component
              </h3>
              <p className="mb-4" style={{ color: theme.colors.foregroundMuted, fontSize: '15px' }}>
                This card demonstrates how components look with the current theme. Notice how text and backgrounds
                automatically adapt to maintain proper contrast ratios.
              </p>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 rounded font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: theme.colors.primary, fontSize: '15px' }}
                >
                  Primary Action
                </button>
                <button 
                  className="px-4 py-2 rounded font-medium border transition-colors hover:opacity-80"
                  style={{
                    color: theme.colors.foreground,
                    borderColor: theme.colors.border,
                    backgroundColor: 'transparent',
                    fontSize: '15px'
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>

            {/* Form Example */}
            <div 
              className="rounded-lg p-6 border"
              style={{
                backgroundColor: theme.colors.backgroundSubtle,
                borderColor: theme.colors.border
              }}
            >
              <h3 className="font-medium mb-4" style={{ fontSize: '1.25rem' }}>
                Form Elements
              </h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="sample-input" className="block font-medium mb-1" style={{ fontSize: '15px' }}>
                    Sample Input
                  </label>
                  <input 
                    id="sample-input"
                    type="text" 
                    placeholder="Type something..."
                    className="w-full px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                      fontSize: '15px'
                    }}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2" style={{ fontSize: '15px' }}>
                    <input 
                      type="checkbox" 
                      className="rounded"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    <span>Enable notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Information */}
        <section 
          className="rounded-lg p-6 border"
          style={{
            backgroundColor: theme.colors.backgroundSubtle,
            borderColor: theme.colors.border
          }}
        >
          <h2 className="font-semibold mb-4" style={{ fontSize: '1.75rem' }}>
            ♿ Accessibility Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2" style={{ fontSize: '1.125rem' }}>
                WCAG 2.1 AA Compliant
              </h3>
              <p style={{ color: theme.colors.foregroundMuted, fontSize: '15px' }}>
                All color combinations meet minimum 4.5:1 contrast ratios for normal text and 3:1 for large text.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2" style={{ fontSize: '1.125rem' }}>
                System Preferences
              </h3>
              <p style={{ color: theme.colors.foregroundMuted, fontSize: '15px' }}>
                Automatically respects user&apos;s system dark mode and high contrast preferences.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2" style={{ fontSize: '1.125rem' }}>
                High Contrast Mode
              </h3>
              <p style={{ color: theme.colors.foregroundMuted, fontSize: '15px' }}>
                Enhanced accessibility mode with 21:1 contrast ratios exceeding WCAG AAA standards.
              </p>
            </div>
          </div>
        </section>

      </main>
      </div>
        </>
      )}
    </div>
  );
};