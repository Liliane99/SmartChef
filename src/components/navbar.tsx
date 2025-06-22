import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ChefHat, User, Moon, Sun, Home, LogIn, User2, LogOut, History, PlusSquare, UserCircle } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    setIsAuthenticated(!!token);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Recettes', href: '/recipes', icon: ChefHat },
  ];

  if (isAuthenticated) {
    navItems.push(
      { name: 'Générer une recette', href: '/generate-recipe', icon: PlusSquare },
      { name: 'Historique des recettes', href: '/history-recipes', icon: History }
    );
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#e8967a] to-[#d4917e] rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-[#e8967a] to-[#d4917e] rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#e8967a] to-[#d4917e] bg-clip-text text-transparent">
              SmartChef
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-link flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#e8967a] hover:bg-[#f7e6e0] dark:hover:bg-gray-800 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-[#e8967a] group-hover:rotate-12 transition-all duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 group-hover:text-[#e8967a] group-hover:rotate-12 transition-all duration-300" />
              )}
            </button>

            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-[#e8967a] to-[#d4917e] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
              <div className="py-2">
                {isAuthenticated ? (
                  <>
                    <a href="/profil" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <UserCircle className="w-4 h-4" />
                      <span>Profil</span>
                    </a>

                    <button 
                      onClick={async () => {
                          try {
                              const res = await fetch('/api/user/logout', { method: 'POST' });
                              if (res.ok) {
                                  window.location.href = '/login';
                              } else {
                                  console.error('Erreur lors de la déconnexion');
                              }
                          } catch (err) {
                              console.error('Erreur réseau de déconnexion :', err);
                          }
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/login" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <LogIn className="w-4 h-4" />
                      <span>Se connecter</span>
                    </a>
                    <a href="/register" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <User2 className="w-4 h-4" />
                      <span>Créer un compte</span>
                    </a>
                  </>
                )}
              </div>

              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-200/20 dark:border-gray-700/20">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e8967a]/20 focus:border-[#e8967a]"
              />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#e8967a] hover:bg-[#f7e6e0] dark:hover:bg-gray-800 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#e8967a] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDark ? 'Mode clair' : 'Mode sombre'}</span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#e8967a] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                <User className="w-5 h-5" />
                <span>Profil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
