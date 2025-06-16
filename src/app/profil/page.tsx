"use client";

import React, { useEffect, useState } from "react";
import {
  Edit2,
  Save,
  Camera,
  Mail,
  Key,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/sidebar";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "********",
    avatar: "/api/placeholder/120/120",
  });
  const [allergies, setAllergies] = useState<string[]>([]);
  const [commonAllergies, setCommonAllergies] = useState<string[]>([]);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  };

  useEffect(() => {
    const token = getCookie("token");

    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    
    const fetchUserProfile = async () => {
      try {
        const userRes = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = await userRes.json();

        setProfile({
          name: user.fields.username,
          email: user.fields.email,
          password: "********",
          avatar: "/api/placeholder/120/120",
        });

        const allergyLabels = user.fields.intolerances || [];
        setAllergies(allergyLabels);
      } catch (err) {
        console.error("Erreur de chargement du profil:", err);
      }
    };

    const fetchAllAllergies = async () => {
      try {
        const res = await fetch("/api/allergy/findAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const labels = data.users.map((r: any) => r.fields.label);
        setCommonAllergies(labels);
      } catch (err) {
        console.error("Erreur chargement allergies:", err);
      }
    };

    const load = async () => {
      await fetchUserProfile();
      await fetchAllAllergies();
      setLoading(false);
    };

    load();
  }, []);

  const getInitials = (name: string): string => {
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
  };

  const handleSave = async () => {
    try {
      const token = getCookie("token");
      if (!token) throw new Error("Token non trouvé");

      const meRes = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const meData = await meRes.json();
      const userId = meData.id;

      const res = await fetch(`/api/user/${userId}/patch`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profile.name,
          email: profile.email,
          password:
            profile.password !== "********" ? profile.password : undefined,
          intolerances: allergies,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur de sauvegarde");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Erreur de sauvegarde:", err);
    }
  };

  const addCommonAllergy = (allergy: string) => {
    if (!allergies.includes(allergy)) {
      setAllergies([...allergies, allergy]);
    }
  };

  const removeAllergy = (allergyToRemove: string) => {
    setAllergies(allergies.filter((a) => a !== allergyToRemove));
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-64 border-r bg-background z-50">
        <Sidebar />
      </div>
      <div className="ml-64 w-full h-screen overflow-y-auto bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
                <p className="text-muted-foreground">
                  Gérez vos informations personnelles et vos allergies alimentaires
                </p>
              </div>
              <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Sauvegarder
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" /> Modifier
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Gérez vos informations de profil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src={profile.avatar} alt={profile.name} />
                          <AvatarFallback>
                            {getInitials(profile.name)}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button size="sm" className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full p-0">
                            <Camera className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label>Pseudo</Label>
                        {isEditing ? (
                          <Input
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                          />
                        ) : (
                          <p className="py-2 font-medium">{profile.name}</p>
                        )}
                      </div>
                      <div>
                        <Label>Email</Label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                          />
                        ) : (
                          <div className="py-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <p>{profile.email}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Mot de passe</Label>
                        {isEditing ? (
                          <Input
                            type="password"
                            value={profile.password}
                            onChange={(e) =>
                              setProfile({ ...profile, password: e.target.value })
                            }
                          />
                        ) : (
                          <div className="py-2 flex items-center gap-2">
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
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Allergies déclarées</span>
                    <Badge className="bg-primary text-white">{allergies.length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Mes allergies alimentaires</CardTitle>
                    <CardDescription>
                      Gérez vos allergies pour recevoir des recommandations personnalisées
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary text-white">
                    {allergies.length} allergie{allergies.length > 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Allergies déclarées</h3>
                  {allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((allergy, index) => (
                        <Badge
                          key={index}
                          className="bg-accent-pink text-primary border border-primary/20"
                        >
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
                    <p className="text-muted-foreground">
                      Aucune allergie déclarée
                    </p>
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
                            ? "bg-accent-pink border-primary text-primary opacity-60"
                            : "hover:border-primary hover:bg-accent-pink hover:text-primary"
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
