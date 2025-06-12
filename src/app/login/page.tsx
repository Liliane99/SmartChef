'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/navbar';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Connexion:', formData);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-20 left-20 w-20 h-20 bg-primary/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/10 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/10 rounded-full animate-pulse delay-500"></div>

      <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <ChefHat className="w-8 h-8 text-primary" />
            </div>
            <div className="text-2xl font-bold">
              Smart<span className="text-primary">Chef</span>
            </div>
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Bon retour !
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Connectez-vous pour découvrir de délicieuses recettes
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-2 focus:border-primary"
                />
              </div>
            </div>

            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 border-2 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked: boolean) => 
                    setFormData(prev => ({ ...prev, rememberMe: checked }))
                  }
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Se souvenir de moi
                </Label>
              </div>
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                Mot de passe oublié ?
              </Button>
            </div>

            
            <Button 
              onClick={handleSubmit}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Se connecter
            </Button>
          </div>

          
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">
              ou continuer avec
            </span>
          </div>

          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </Button>
          </div>

          
          <div className="text-center pt-4">
            <p className="text-muted-foreground">
              Pas encore de compte ?{' '}
              <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-semibold">
                Créer un compte
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );

  
}