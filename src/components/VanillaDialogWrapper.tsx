"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@my-app/core";
import { dialogManager } from "@my-app/core/src/dialogManager"; // Import dialogManager
import DialogTabs from "./DialogTabs"; // Import the new DialogTabs component

interface VanillaDialogWrapperProps {
  title: string;
  content: string;
}

const VanillaDialogWrapper: React.FC<VanillaDialogWrapperProps> = ({ title, content }) => {
  const [openDialogInstances, setOpenDialogInstances] = useState<Dialog[]>([]);
  const [selectedDialogId, setSelectedDialogId] = useState<string | null>(null);

  useEffect(() => {
    // Met à jour selectedDialogId lorsque des boîtes de dialogue sont ouvertes/fermées
    if (openDialogInstances.length > 0 && !selectedDialogId) {
      setSelectedDialogId(openDialogInstances[0].id);
    } else if (openDialogInstances.length === 0) {
      setSelectedDialogId(null);
    } else if (selectedDialogId && !openDialogInstances.some(d => d.id === selectedDialogId)) {
      // Si la boîte de dialogue sélectionnée a été fermée, sélectionnez la première disponible ou null
      setSelectedDialogId(openDialogInstances[0]?.id || null);
    }
  }, [openDialogInstances, selectedDialogId]);

  const openNewDialog = () => {
    const newDialog = new Dialog({
      title: `${title} #${openDialogInstances.length + 1}`,
      content: `${content} This is dialog number ${openDialogInstances.length + 1}.`,
      onClose: (closedDialogId) => { // Reçoit l'ID de la boîte de dialogue fermée
        setOpenDialogInstances((prevDialogs) => {
          const updatedDialogs = prevDialogs.filter((d) => d.id !== closedDialogId);
          return updatedDialogs;
        });
      },
    });
    newDialog.render();
    setOpenDialogInstances((prevDialogs) => [...prevDialogs, newDialog]);
    setSelectedDialogId(newDialog.id); // Sélectionne la boîte de dialogue nouvellement ouverte
  };

  const handleSelectDialog = (id: string) => {
    setSelectedDialogId(id);
    dialogManager.bringToFront(id);
  };

  const handleCloseDialog = (id: string) => {
    const dialogToClose = openDialogInstances.find(d => d.id === id);
    if (dialogToClose) {
      dialogToClose.close(); // Cela déclenchera le callback onClose passé lors de la création
    }
  };

  const dialogTabsData = openDialogInstances.map(d => ({
    id: d.id,
    title: d.options.title, // Accède au titre via la propriété options rendue publique
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