"use client";

import React from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DocSection {
  id: string;
  title: string;
  level: 2 | 3; // h2 or h3
  subsections?: DocSection[];
}

const docSections: DocSection[] = [
  {
    id: "demarrage-rapide",
    title: "Démarrage Rapide",
    level: 2,
    subsections: [
      { id: "installation", title: "Installation", level: 3 },
      { id: "utilisation-de-base", title: "Utilisation de base", level: 3 },
      { id: "gestion-du-mode-sombre", title: "Gestion du Mode Sombre", level: 3 },
    ],
  },
  {
    id: "dialog-manager",
    title: "`DialogManager`",
    level: 2,
    subsections: [
      { id: "dm-methodes", title: "Méthodes", level: 3 },
      { id: "dm-proprietes", title: "Propriétés", level: 3 },
      { id: "dm-evenements", title: "Événements", level: 3 },
    ],
  },
  {
    id: "dialog-class",
    title: "`Dialog`",
    level: 2,
    subsections: [
      { id: "creation-dialog-directe", title: "Création d'une `Dialog` directe", level: 3 }, // Nouvelle sous-section
      { id: "dialog-options-interface", title: "Interface `DialogOptions`", level: 3 },
      { id: "dialog-proprietes", "title": "Propriétés", level: 3 },
      { id: "dialog-methodes", title: "Méthodes", level: 3 },
    ],
  },
];

const DocumentationSidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
      <ScrollArea className="h-full pr-4">
        <nav className="space-y-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Table des Matières</h3>
          {docSections.map((section) => (
            <div key={section.id}>
              <Link
                to={`#${section.id}`}
                className="block text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              >
                {section.title}
              </Link>
              {section.subsections && (
                <div className="ml-4 mt-1 space-y-1">
                  {section.subsections.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`#${sub.id}`}
                      className="block text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default DocumentationSidebar;