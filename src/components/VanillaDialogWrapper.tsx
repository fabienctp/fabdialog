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
  }, []);

  const openNewDialog = () => {
    dialogManager.createDialog({
      title: `${title} #${dialogManager.activeDialogs.size + 1}`,
      content: `${content} This is dialog number ${dialogManager.activeDialogs.size + 1}.`,
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={openNewDialog}>Open New Vanilla Dialog</Button>
      <p className="mt-2 text-sm text-gray-500">
        Dialogs are now managed by the core library, including the tabs below.
      </p>
      <div ref={tabsContainerRef} className="w-full">
        {/* VanillaDialogTabs will render here */}
      </div>
    </div>
  );
};

export default VanillaDialogWrapper;