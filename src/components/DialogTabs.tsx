"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogTab {
  id: string;
  title: string;
}

interface DialogTabsProps {
  openDialogs: DialogTab[];
  selectedDialogId: string | null;
  onSelectDialog: (id: string) => void;
  onCloseDialog: (id: string) => void;
}

const DialogTabs: React.FC<DialogTabsProps> = ({
  openDialogs,
  selectedDialogId,
  onSelectDialog,
  onCloseDialog,
}) => {
  if (openDialogs.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 shadow-lg z-[10000]">
      <Tabs value={selectedDialogId || openDialogs[0]?.id} onValueChange={onSelectDialog}>
        <TabsList className="flex flex-wrap justify-start h-auto">
          {openDialogs.map((dialog) => (
            <TabsTrigger
              key={dialog.id}
              value={dialog.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm",
                selectedDialogId === dialog.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="truncate max-w-[150px]">{dialog.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0.5 rounded-sm hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation(); // Empêche la sélection de l'onglet lors de la fermeture
                  onCloseDialog(dialog.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DialogTabs;