"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Plus, ArrowRight, AlertCircle, Utensils, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Allergy = {
  id: string;
  label: string;
};

const AllergiesSelectionPage = () => {
  const router = useRouter();
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [allergyOptions, setAllergyOptions] = useState<Allergy[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/login");
      return;
    }

    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const fetchAllergies = async () => {
      try {
        const res = await fetch("/api/allergy/findAll", {
          method: "GET",
          headers: authHeaders,
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const allergies: Allergy[] = data.users.map((record: any) => ({
          id: record.id,
          label: record.fields.label,
        }));
        setAllergyOptions(allergies);
      } catch (error) {
        console.error("Erreur lors du chargement des allergies :", error);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          headers: authHeaders,
        });
        if (!res.ok) {
          console.error("User fetch failed:", await res.text());
          router.push("/login");
          return;
        }
        const user = await res.json();
        setUserId(user.id);
      } catch (error) {
        console.error("Erreur lors du fetch user :", error);
        router.push("/login");
      }
    };

    fetchAllergies();
    fetchUser();
  }, []);

  const toggleAllergy = (allergyId: string): void => {
    setSelectedAllergies((prev) =>
      prev.includes(allergyId) ? prev.filter((id) => id !== allergyId) : [...prev, allergyId]
    );
  };

  const addCustomAllergy = async () => {
    const trimmed = customAllergy.trim();
    if (!trimmed) return;

    try {
      const res = await fetch("/api/allergy/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: trimmed }),
      });

      const data = await res.json();
      if (!res.ok && data.error !== "Allergy already exists") {
        throw new Error(data.error || "Erreur ajout allergie");
      }

      // On récupère l'id du nouvel enregistrement
      const newAllergy: Allergy = { id: data.id, label: trimmed };
      setSelectedAllergies((prev) => [...prev, newAllergy.id]);
      setAllergyOptions((prev) => [...prev, newAllergy]);
      setCustomAllergy("");
      setShowCustomInput(false);
    } catch (error) {
      console.error("Erreur ajout allergie :", error);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/${userId}/patch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intolerances: selectedAllergies }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur mise à jour utilisateur");
      }

      router.push("/profil");
    } catch (error) {
      console.error("Erreur soumission :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => router.push("/profil");

  return (
    <div className="min-h-screen bg-gradient-accent flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Vos allergies alimentaires</h1>
          <p className="text-text-light text-lg">Aidez-nous à personnaliser vos recommandations alimentaires</p>
        </div>

        <Card className="shadow-primary-lg border-0 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Utensils className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Sélectionnez vos allergies</CardTitle>
                <CardDescription className="text-base">
                  Choisissez toutes les allergies qui vous concernent pour une expérience personnalisée
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {selectedAllergies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Allergies sélectionnées</h3>
                  <Badge className="bg-primary text-white text-sm">
                    {selectedAllergies.length} allergie{selectedAllergies.length > 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedAllergies.map((id) => {
                    const allergy = allergyOptions.find((a) => a.id === id);
                    if (!allergy) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 bg-accent-pink p-3 rounded-lg border border-primary/20">
                        <span className="font-medium text-primary flex-1">{allergy.label}</span>
                        <Button variant="ghost" size="sm" onClick={() => toggleAllergy(id)} className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Allergies connues</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allergyOptions.map((allergy) => {
                  const isSelected = selectedAllergies.includes(allergy.id);
                  return (
                    <div
                      key={allergy.id}
                      onClick={() => toggleAllergy(allergy.id)}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isSelected ? "border-primary bg-accent-pink shadow-primary" : "border-border bg-card hover:border-primary/50 hover:bg-accent-pink/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{allergy.label}</span>
                        {isSelected && (
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">Allergie non listée ?</h3>
                <Button variant="outline" size="sm" onClick={() => setShowCustomInput(!showCustomInput)} className="border-primary text-primary hover:bg-accent-pink">
                  <Plus className="w-4 h-4 mr-1" /> Ajouter
                </Button>
              </div>

              {showCustomInput && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom de l'allergie..."
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCustomAllergy()}
                    className="flex-1"
                  />
                  <Button onClick={addCustomAllergy} className="bg-primary text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={() => { setShowCustomInput(false); setCustomAllergy(""); }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Alert className="mb-6 border-primary/20 bg-accent-pink">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-text-dark">
            <strong>Important :</strong> Ces informations nous aident à personnaliser vos recettes. Vous pourrez toujours modifier vos allergies dans votre profil.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={handleSkip} disabled={isLoading} className="px-8 py-3 text-base border-primary text-primary hover:bg-accent-pink">
            Passer cette étape
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="px-8 py-3 text-base bg-primary text-white hover:bg-primary-dark">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Continuer <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-8 h-2 bg-primary rounded-full"></div>
            <div className="w-8 h-2 bg-primary rounded-full"></div>
          </div>
          <p className="text-sm text-text-light">Étape 2 sur 2 - Configuration du profil</p>
        </div>
      </div>
    </div>
  );
};

export default AllergiesSelectionPage;
