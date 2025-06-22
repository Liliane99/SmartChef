import React, { useState } from 'react';
import { 
  User, 
  ChefHat,  
  Menu, 
  X, 
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const Sidebar = ({ activeSection = 'profile', onSectionChange }: { activeSection?: string; onSectionChange?: (sectionId: string) => void }) => {
  const [isCollapsed, _setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      id: 'profile',
      label: 'Mon Profil',
      icon: User,
      path: "/profil",
      description: 'Gérer mes informations',
      badge: null
    }
  ];

  const handleSectionChange = (sectionId: string): void => {
    onSectionChange?.(sectionId);
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sidebar-foreground text-lg">SmartChef</h2>
                <p className="text-xs text-muted-foreground">Assistant culinaire</p>
              </div>
            </>
          )}
        </div>
      </div>
      <nav className="flex-1 p-4">
        <div className="space-y-2 mb-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Link key={item.id} href={item.path} passHref>
                <Button
                  variant="ghost"
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full justify-start p-3 h-auto ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-primary/20' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sidebar-primary' : ''} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary"
                            className="ml-2 bg-primary text-white text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
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
        >
          <LogOut className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && 'Déconnexion'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm border border-border"
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className={`hidden lg:flex flex-col h-screen ${isCollapsed ? 'w-16' : 'w-80'} transition-all duration-300`}>
        <SidebarContent />
      </div>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="relative flex flex-col w-80 max-w-sm bg-sidebar border-r border-sidebar-border">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
