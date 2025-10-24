"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@my-app/core";
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
    // No need to subscribe to focus changes here, as VanillaDialogTabs handles it directly
    // and this component doesn't need to react to individual dialog focus changes anymore.
  }, []); // Run once on mount

  const openNewDialog = () => {
    const newDialog = new Dialog({
      title: `${title} #${dialogManager.activeDialogs.size + 1}`, // Use manager's size for numbering
      content: `${content} This is dialog number ${dialogManager.activeDialogs.size + 1}.`,
      // onClose is now handled by dialogManager.unregisterDialog, which is called by VanillaDialogTabs
      // when the close button is clicked.
    });
    newDialog.render();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={openNewDialog}>Open New Vanilla Dialog</Button>
      <p className="mt-2 text-sm text-gray-500">
        Dialogs are now managed by the core library, including the tabs below.
      </p>
      {/* This div will be the container for the vanilla dialog tabs */}
      <div ref={tabsContainerRef} className="w-full">
        {/* VanillaDialogTabs will render here */}
      </div>
    </div>
  );
};

export default VanillaDialogWrapper;