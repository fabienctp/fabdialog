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

  useEffect(() => {
    // This effect ensures that if the currently selected dialog is closed,
    // another dialog (if available) is automatically selected and brought to front.
    // It also handles the initial state when dialogs are first opened.

    // If there are open dialogs but no dialog is currently selected/focused (e.g., after closing the last focused one)
    if (openDialogInstances.length > 0 && !dialogManager.focusedDialogId) {
      const firstDialogId = openDialogInstances[0].id;
      dialogManager.bringToFront(firstDialogId); // This will update selectedDialogId via the listener
    } else if (openDialogInstances.length === 0) {
      // If all dialogs are closed, ensure no tab is selected
      setSelectedDialogId(null);
    } else if (dialogManager.focusedDialogId && !openDialogInstances.some(d => d.id === dialogManager.focusedDialogId)) {
      // If the currently focused dialog (according to manager) was closed,
      // select the first available dialog or null.
      const newSelectedId = openDialogInstances[0]?.id || null;
      if (newSelectedId) {
        dialogManager.bringToFront(newSelectedId); // This will update selectedDialogId via the listener
      } else {
        setSelectedDialogId(null); // No dialogs left
      }
    }
  }, [openDialogInstances]); // Only depend on openDialogInstances


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
    // The `bringToFront` call inside `newDialog.render()` will trigger the `onFocusChange` listener,
    // which will then update `selectedDialogId`.
  };

  const handleSelectDialog = (id: string) => {
    // This will trigger the onFocusChange listener in the manager,
    // which then updates the selectedDialogId state in this component.
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