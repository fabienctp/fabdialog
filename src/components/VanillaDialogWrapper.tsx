"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@my-app/core";
import { dialogManager } from "@my-app/core/src/dialogManager";
import DialogTabs from "./DialogTabs";

interface VanillaDialogWrapperProps {
  title: string;
  content: string;
}

const VanillaDialogWrapper: React.FC<VanillaDialogWrapperProps> = ({ title, content }) => {
  const [openDialogInstances, setOpenDialogInstances] = useState<Dialog[]>([]);
  const [selectedDialogId, setSelectedDialogId] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to dialog focus changes
    const handleFocusChange = (focusedId: string | null) => {
      setSelectedDialogId(focusedId);
    };
    dialogManager.onFocusChange(handleFocusChange);

    // Initial sync: Set selectedDialogId to the currently focused dialog if any
    setSelectedDialogId(dialogManager.focusedDialogId);

    return () => {
      // Clean up the listener when the component unmounts
      dialogManager.onFocusChange(() => {}); // Reset the listener to prevent memory leaks
    };
  }, []); // Run once on mount and cleanup on unmount

  // La logique de gestion du focus a été déplacée vers le dialogManager.
  // Ce useEffect n'est plus nécessaire.

  const openNewDialog = () => {
    const newDialog = new Dialog({
      title: `${title} #${openDialogInstances.length + 1}`,
      content: `${content} This is dialog number ${openDialogInstances.length + 1}.`,
      onClose: (closedDialogId) => {
        setOpenDialogInstances((prevDialogs) => {
          const updatedDialogs = prevDialogs.filter((d) => d.id !== closedDialogId);
          return updatedDialogs;
        });
      },
    });
    newDialog.render();
    setOpenDialogInstances((prevDialogs) => [...prevDialogs, newDialog]);
    // L'appel `bringToFront` dans `newDialog.render()` déclenchera le listener `onFocusChange`,
    // qui mettra ensuite à jour `selectedDialogId`.
  };

  const handleSelectDialog = (id: string) => {
    // Cela déclenchera le listener onFocusChange dans le gestionnaire,
    // qui mettra ensuite à jour l'état selectedDialogId dans ce composant.
    dialogManager.bringToFront(id);
  };

  const handleCloseDialog = (id: string) => {
    const dialogToClose = openDialogInstances.find(d => d.id === id);
    if (dialogToClose) {
      dialogToClose.close();
    }
  };

  const dialogTabsData = openDialogInstances.map(d => ({
    id: d.id,
    title: d.options.title,
  }));

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={openNewDialog}>Open New Vanilla Dialog</Button>
      {openDialogInstances.length > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          {openDialogInstances.length} dialog(s) open. Click on a dialog to bring it to front.
        </p>
      )}
      <DialogTabs
        openDialogs={dialogTabsData}
        selectedDialogId={selectedDialogId}
        onSelectDialog={handleSelectDialog}
        onCloseDialog={handleCloseDialog}
      />
    </div>
  );
};

export default VanillaDialogWrapper;