'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Mail, Lock, Eye, EyeOff, User, Calendar, Check, X } from 'lucide-react';
import Navbar from '@/components/navbar';

interface FormData {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password: string): PasswordStrength => {
    const checks = [
      { test: password.length >= 8, message: "Au moins 8 caractères" },
      { test: /[A-Z]/.test(password), message: "Une majuscule" },
      { test: /[a-z]/.test(password), message: "Une minuscule" },
      { test: /\d/.test(password), message: "Un chiffre" },
      { test: /[!@#$%^&*(),.?\":{}|<>]/.test(password), message: "Un caractère spécial" }
    ];
    
    const score = checks.filter(check => check.test).length;
    const feedback = checks.map(check => ({
      ...check,
      passed: check.test
    }));
    
    return { score, feedback: feedback.map(f => f.message) };
  };

  const passwordStrength = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Faible';
    if (score <= 3) return 'Moyen';
    if (score <= 4) return 'Bon';
    return 'Excellent';
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.firstName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Une erreur est survenue.');
        return;
      }

      const result = await response.json();
      console.log('Inscription réussie:', result);
      window.location.href = '/login'; 
    } catch (err) {
      console.error('Erreur lors de l’inscription:', err);
      setError("Erreur de réseau ou serveur.");
    }
  };

  
  const isFormValid = 
    formData.firstName.trim() !== '' &&
    formData.email.trim() !== '' &&
    passwordStrength.score >= 4 &&
    passwordsMatch &&
    formData.acceptTerms;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 bg-primary/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-accent/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-primary/15 rounded-full animate-pulse delay-700"></div>

        <Card className="w-full max-w-lg shadow-xl border-0 bg-card/95 backdrop-blur-sm my-8">
          <CardHeader className="space-y-4 text-center">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Rejoignez-nous !
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Créez votre compte pour découvrir des milliers de recettes
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Pseudo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-2 focus:border-primary"
                  />
                </div>
              </div>

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
                
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Force du mot de passe</span>
                      <span className={`font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-500' :
                        passwordStrength.score <= 3 ? 'text-yellow-500' :
                        passwordStrength.score <= 4 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                        {getStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${
                            i <= passwordStrength.score ? getStrengthColor(passwordStrength.score) : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        "Au moins 8 caractères",
                        "Une majuscule",
                        "Une minuscule",
                        "Un chiffre",
                        "Un caractère spécial"
                      ].map((requirement, index) => {
                        const isValid = passwordStrength.score > index;
                        return (
                          <div key={requirement} className={`flex items-center space-x-1 ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
                            {isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>{requirement}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-12 border-2 focus:border-primary ${
                      formData.confirmPassword && !passwordsMatch ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas.</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked: boolean) => 
                    setFormData(prev => ({ ...prev, acceptTerms: checked }))
                  }
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  J'accepte les{' '}
                  <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 text-sm">
                    conditions d'utilisation
                  </Button>
                  {' '}et la{' '}
                  <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 text-sm">
                    politique de confidentialité
                  </Button>
                </Label>
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full h-12 font-semibold transition-all duration-300 ${
                isFormValid 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg hover:-translate-y-0.5' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Créer mon compte
            </Button>

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
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.97 20.99 7.69 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1a7.303 7.303 0 0 1 0-4.2V7.06H2.18a11.954 11.954 0 0 0 0 9.88l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.4c1.61 0 3.06.55 4.2 1.62l3.15-3.15C17.45 2.18 14.97 1.2 12 1.2 7.69 1.2 3.97 3.21 2.18 6.98l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Inscription avec Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
