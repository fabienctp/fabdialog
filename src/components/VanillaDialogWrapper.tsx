"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { dialogManager } from "@my-app/core/src/dialogManager"; // Ensure correct import path

interface VanillaDialogWrapperProps {
  title: string;
  content: string;
}

const VanillaDialogWrapper: React.FC<VanillaDialogWrapperProps> = ({ title, content }) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsContainerRef.current) {
      dialogManager.initVanillaTabs(tabsContainerRef.current);
    }
    // No need to add/remove event listeners here anymore, EventLog handles it.
  }, []);

  const openNewDialog = () => {
    dialogManager.createDialog({
      title: `${title} #${dialogManager.activeDialogs.size + 1}`,
      content: `${content} Ceci est la boîte de dialogue numéro ${dialogManager.activeDialogs.size + 1}.`,
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={openNewDialog}>Ouvrir une nouvelle boîte de dialogue Vanilla</Button>
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