"use client";

import React from "react";
import { Button } from "@/components/ui/button";

const HeroBanner: React.FC = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-primary to-primary-lighter-20 text-primary-foreground py-20 px-4 sm:px-6 lg:px-8 text-center rounded-lg shadow-xl mb-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-4">
          Construisez des expériences dynamiques
        </h1>
        <p className="mt-4 text-xl sm:text-2xl opacity-90">
          Découvrez la puissance des boîtes de dialogue interactives et des composants modernes pour votre application React.
        </p>
        <div className="mt-10 flex justify-center">
          <Button size="lg">
            Commencer l'exploration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;