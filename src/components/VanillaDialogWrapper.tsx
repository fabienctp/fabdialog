"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { dialogManager } from "@my-app/core/src/dialogManager";
import { DialogOptions } from "@my-app/core/src/dialog"; // Import DialogOptions
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import shadcn Select components
import { cn } from "@/lib/utils"; // Import cn utility for merging classes

interface VanillaDialogWrapperProps {
  title: string;
  content: string;
}

const VanillaDialogWrapper: React.FC<VanillaDialogWrapperProps> = ({ title, content }) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [dialogSize, setDialogSize] = useState<DialogOptions['size']>('medium'); // État pour la taille de la boîte de dialogue

  useEffect(() => {
    if (tabsContainerRef.current) {
      dialogManager.initVanillaTabs(tabsContainerRef.current);
    }
  }, []);

  const openNewDialog = () => {
    dialogManager.createDialog({
      title: `${title} #${dialogManager.activeDialogs.size + 1}`,
      content: `${content} Ceci est la boîte de dialogue numéro ${dialogManager.activeDialogs.size + 1}.`,
      size: dialogSize, // Utilise la taille sélectionnée
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-4">
        <Select value={dialogSize} onValueChange={(value: DialogOptions['size']) => setDialogSize(value)}>
          <SelectTrigger 
            className={cn(
              "w-[180px] bg-white text-gray-900 border border-gray-200", // Styles pour le mode clair
              "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" // Styles pour le mode sombre
            )}
          >
            <SelectValue placeholder="Taille de la boîte de dialogue" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              "bg-white text-gray-900 border border-gray-200", // Styles pour le mode clair
              "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700" // Styles pour le mode sombre
            )}
          >
            <SelectItem value="small">Petite</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
            <SelectItem value="full">Pleine</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openNewDialog}>Ouvrir une nouvelle boîte de dialogue Vanilla</Button>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Les boîtes de dialogue sont maintenant gérées par la bibliothèque principale, y compris les onglets ci-dessous.
      </p>
      <div ref={tabsContainerRef} className="w-full">
        {/* VanillaDialogTabs will render here */}
      </div>
    </div>
  );
};

export default VanillaDialogWrapper;