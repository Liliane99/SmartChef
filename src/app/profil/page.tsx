"use client";

import React, { useState } from 'react';
import { User, Settings, Bell, Shield, Plus, X, Edit2, Save, Camera, Mail, Phone, MapPin, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Sidebar from '@/components/sidebar';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [profile, setProfile] = useState({
    name: 'Marie.D',
    email: 'marie.dubois@email.com',
    password: '********',
    avatar: '/api/placeholder/120/120'
  });

  const [allergies, setAllergies] = useState([
    'Arachides',
    'Fruits de mer',
    'Lactose',
    'Gluten'
  ]);

  const commonAllergies = [
    'Arachides', 'Fruits de mer', 'Lactose', 'Gluten', 'Œufs', 'Soja', 
    'Noix', 'Poisson', 'Sésame', 'Moutarde', 'Céleri', 'Lupin'
  ];

  const removeAllergy = (allergyToRemove: string): void => {
    setAllergies(allergies.filter((allergy: string) => allergy !== allergyToRemove));
  };

  const addCommonAllergy = (allergy: string): void => {
    if (!allergies.includes(allergy)) {
      setAllergies([...allergies, allergy]);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-64 border-r bg-background z-50">
        <Sidebar />
      </div>
      <div className="ml-64 w-full h-screen overflow-y-auto bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles et vos allergies alimentaires</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Informations personnelles</CardTitle>
                      <CardDescription>Gérez vos informations de profil</CardDescription>
                    </div>
                    <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="bg-primary text-white">
                      {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                      {isEditing ? 'Sauvegarder' : 'Modifier'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src={profile.avatar} alt={profile.name} />
                          <AvatarFallback className="text-2xl font-bold text-white bg-primary">
                            {getInitials(profile.name)}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button size="sm" className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full p-0 bg-primary text-white">
                            <Camera className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <Label htmlFor="name">Pseudo</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        ) : (
                          <p className="font-medium py-2">{profile.name}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center gap-2 py-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <p>{profile.email}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="password">Mot de passe</Label>
                        {isEditing ? (
                          <Input
                            id="password"
                            type="password"
                            value={profile.password}
                            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center gap-2 py-2">
                            <Key className="w-4 h-4 text-primary" />
                            <p>{profile.password}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Allergies déclarées</span>
                    <Badge className="bg-primary text-white">{allergies.length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-8">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Mes allergies alimentaires</CardTitle>
                    <CardDescription>Gérez vos allergies pour recevoir des recommandations personnalisées</CardDescription>
                  </div>
                  <Badge className="bg-primary text-white">{allergies.length} allergie{allergies.length > 1 ? 's' : ''}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Allergies déclarées</h3>
                  {allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((allergy, index) => (
                        <Badge key={index} className="bg-accent-pink text-primary border border-primary/20">
                          {allergy}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAllergy(allergy)}
                            className="ml-2 h-auto p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucune allergie déclarée</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Ajouter une allergie</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {commonAllergies.map((allergy) => (
                      <Button
                        key={allergy}
                        variant="outline"
                        onClick={() => addCommonAllergy(allergy)}
                        disabled={allergies.includes(allergy)}
                        className={`p-3 h-auto justify-center ${
                          allergies.includes(allergy)
                            ? 'bg-accent-pink border-primary text-primary opacity-60'
                            : 'hover:border-primary hover:bg-accent-pink hover:text-primary'
                        }`}
                      >
                        {allergy}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
