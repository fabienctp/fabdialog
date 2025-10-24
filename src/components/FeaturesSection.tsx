"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, LayoutPanelTop, Minimize, Rows3, ScrollText, Code } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Gestionnaire de Dialogues Robuste",
    description: "Centralisez la gestion du cycle de vie, de l'état et de l'interaction de toutes vos boîtes de dialogue.",
  },
  {
    icon: LayoutPanelTop,
    title: "Boîtes de Dialogue Personnalisables",
    description: "Créez des boîtes de dialogue uniques avec du contenu HTML ou des éléments DOM pour une flexibilité maximale.",
  },
  {
    icon: Minimize,
    title: "Fonctionnalités Avancées",
    description: "Profitez de la minimisation, de l'agrandissement, du redimensionnement et du glisser-déposer intégrés.",
  },
  {
    icon: Rows3,
    title: "Onglets de Dialogue Intuitifs",
    description: "Gérez sans effort une ou plusieurs boîtes de dialogue grâce au `DialogManager`, avec une navigation intuitive sous forme d'onglets dynamiques et réactifs.",
  },
  {
    icon: ScrollText,
    title: "Événements Détaillés",
    description: "Suivez le cycle de vie de chaque boîte de dialogue grâce à un système d'événements personnalisés sur la fenêtre.",
  },
  {
    icon: Code,
    title: "Vanilla TypeScript Léger",
    description: "Une bibliothèque performante et sans dépendances lourdes, facile à intégrer dans n'importe quel projet.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg mb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Découvrez les Capacités de FabDialog
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Une solution complète pour des boîtes de dialogue interactives et performantes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;