import React, { useEffect, useState } from 'react';

const themes = {
  'glass-light': {
    name: 'glass-light',
    displayName: 'Glass Light',
    colors: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
      backgroundSubtle: 'rgba(255, 255, 255, 0.6)',
      backgroundMuted: 'rgba(248, 250, 252, 0.8)',
      foreground: 'rgba(15, 23, 42, 0.95)',
      foregroundMuted: 'rgba(71, 85, 105, 0.8)',
      primary: 'rgba(59, 130, 246, 0.8)',
      primaryEmphasis: 'rgba(37, 99, 235, 0.9)',
      success: 'rgba(34, 197, 94, 0.8)',
      warning: 'rgba(245, 158, 11, 0.8)',
      error: 'rgba(239, 68, 68, 0.8)',
      border: 'rgba(226, 232, 240, 0.6)',
    }
  },
    'glass-dark': {
    name: 'glass-dark',
    displayName: 'Glass Dark',
    colors: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)',
      backgroundSubtle: 'rgba(139, 92, 246, 0.15)',
      backgroundMuted: 'rgba(59, 130, 246, 0.2)',
      foreground: 'rgba(255, 255, 255, 0.95)',
      foregroundMuted: 'rgba(255, 255, 255, 0.7)',
      primary: 'rgba(139, 92, 246, 0.9)',
      primaryEmphasis: 'rgba(124, 58, 237, 1)',
      success: 'rgba(34, 197, 94, 0.8)',
      warning: 'rgba(245, 158, 11, 0.8)',
      error: 'rgba(239, 68, 68, 0.8)',
      border: 'rgba(139, 92, 246, 0.3)',
    }
  }
};

export default PremiumThemeDemo;
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
        background: currentTheme === 'glass-dark'
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #bae6fd 75%, #f8fafc 100%)',
        color: theme.colors.foreground,
        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '18px',
        lineHeight: '1.6'
      }}
    >
      {/* Background overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: currentTheme === 'glass-dark'
            ? 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.6) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.5) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
          zIndex: -1
        }}
      />

      {/* Glass Layout with Sidebar */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div 
          className="w-36 min-h-screen border-r backdrop-blur-xl"
          style={{
            background: currentTheme === 'glass-dark' 
              ? 'rgba(139, 92, 246, 0.08)'
              : 'rgba(255, 255, 255, 0.7)',
            borderColor: theme.colors.border,
            backdropFilter: 'blur(20px)',
            boxShadow: currentTheme === 'glass-dark'
              ? '0 8px 32px 0 rgba(139, 92, 246, 0.3)'
              : '0 8px 32px 0 rgba(15, 23, 42, 0.1)'
          }}
        >
          <div className="p-6">
            <h1 className="font-bold text-xl mb-8" style={{ color: theme.colors.foreground }}>
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
                  key={item.label}
                  className="w-full text-left px-3 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm text-lg font-medium"
                  style={{
                    background: item.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    color: theme.colors.foreground,
                    border: item.active ? `1px solid ${theme.colors.border}` : '1px solid transparent',
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
              background: currentTheme === 'glass-dark'
                ? 'rgba(139, 92, 246, 0.12)'
                : 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${theme.colors.border}`,
              backdropFilter: 'blur(25px)',
              boxShadow: currentTheme === 'glass-dark'
                ? '0 8px 32px 0 rgba(139, 92, 246, 0.2)'
                : '0 8px 32px 0 rgba(15, 23, 42, 0.08)'
            }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold" style={{ color: theme.colors.foreground }}>
                Glass Interface Demo
              </h2>
              <div className="flex gap-3">
                {['glass-light', 'glass-dark'].map((themeKey) => (
                  <button
                    key={themeKey}
                    onClick={() => handleThemeChange(themeKey as keyof typeof themes)}
                    className="px-4 py-2 rounded-lg text-base backdrop-blur-sm transition-all duration-150"
                    style={{
                      background: currentTheme === themeKey ? 'rgba(139, 92, 246, 0.7)' : 'rgba(255, 255, 255, 0.1)',
                      color: theme.colors.foreground,
                      border: `1px solid ${theme.colors.border}`,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {themeKey === 'glass-light' ? '☀️ Glass Light' : '🌙 Glass Dark'}
                  </button>
                ))}
                <button
                  onClick={() => handleThemeChange('system')}
                  className="px-3 py-1 rounded-lg text-sm backdrop-blur-sm transition-all duration-150"
                  style={{
                    background: userTheme === 'system' ? 'rgba(139, 92, 246, 0.7)' : 'rgba(255, 255, 255, 0.1)',
                    color: theme.colors.foreground,
                    border: `1px solid ${theme.colors.border}`,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  🖥️ System
                </button>
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
                key={stat.title}
                className="p-6 rounded-xl backdrop-blur-xl"
                style={{
                  background: currentTheme === 'glass-dark'
                    ? 'rgba(139, 92, 246, 0.15)'
                    : 'rgba(255, 255, 255, 0.6)',
                  border: `1px solid ${theme.colors.border}`,
                  backdropFilter: 'blur(25px)',
                  boxShadow: currentTheme === 'glass-dark'
                    ? '0 8px 32px 0 rgba(139, 92, 246, 0.25)'
                    : '0 8px 32px 0 rgba(15, 23, 42, 0.06)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ background: stat.color }}
                  />
                </div>
                <h3 className="text-base font-medium mb-1" style={{ color: theme.colors.foregroundMuted }}>
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold" style={{ color: theme.colors.foreground }}>
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
                background: currentTheme === 'glass-dark'
                  ? 'rgba(139, 92, 246, 0.12)'
                  : 'rgba(255, 255, 255, 0.6)',
                border: `1px solid ${theme.colors.border}`,
                backdropFilter: 'blur(25px)',
                boxShadow: currentTheme === 'glass-dark'
                  ? '0 8px 32px 0 rgba(139, 92, 246, 0.2)'
                  : '0 8px 32px 0 rgba(15, 23, 42, 0.06)'
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
                Glass Form
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-base font-medium mb-2" style={{ color: theme.colors.foregroundMuted }}>
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-lg backdrop-blur-sm border"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${theme.colors.border}`,
                      color: theme.colors.foreground,
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2" style={{ color: theme.colors.foregroundMuted }}>
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 rounded-lg backdrop-blur-sm border"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${theme.colors.border}`,
                      color: theme.colors.foreground,
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
                    border: `1px solid ${theme.colors.border}`,
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
                background: currentTheme === 'glass-dark'
                  ? 'rgba(139, 92, 246, 0.12)'
                  : 'rgba(255, 255, 255, 0.6)',
                border: `1px solid ${theme.colors.border}`,
                backdropFilter: 'blur(25px)',
                boxShadow: currentTheme === 'glass-dark'
                  ? '0 8px 32px 0 rgba(139, 92, 246, 0.2)'
                  : '0 8px 32px 0 rgba(15, 23, 42, 0.06)'
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.foreground }}>
                Interactive Controls
              </h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="opacity" className="block text-sm font-medium mb-2" style={{ color: theme.colors.foregroundMuted }}>
                    Opacity: 75%
                  </label>
                  <input
                    id="opacity"
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full h-2 rounded-lg appearance-none"
                    style={{
                      background: `rgba(255, 255, 255, 0.2)`,
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="blur" className="block text-sm font-medium mb-2" style={{ color: theme.colors.foregroundMuted }}>
                    Blur Intensity: 50%
                  </label>
                  <input
                    id="blur"
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
                  <span style={{ color: theme.colors.foregroundMuted }}>Dark Mode</span>
                  <div 
                    className="w-12 h-6 rounded-full p-1 backdrop-blur-sm cursor-pointer"
                    style={{
                      background: currentTheme === 'glass-dark' ? 'rgba(139, 92, 246, 0.7)' : 'rgba(255, 255, 255, 0.2)',
                      border: `1px solid ${theme.colors.border}`
                    }}
                    onClick={() => handleThemeChange(currentTheme === 'glass-dark' ? 'glass-light' : 'glass-dark')}
                  >
                    <div 
                      className="w-4 h-4 rounded-full bg-white transition-transform duration-200"
                      style={{ transform: currentTheme === 'glass-dark' ? 'translateX(100%)' : 'translateX(0%)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};