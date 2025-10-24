"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { dialogManager, DIALOG_EVENTS } from "@my-app/core/src/dialogManager"; // Ensure correct import path and DIALOG_EVENTS
import { toast } from "sonner"; // Using sonner for toasts

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

    const handleDialogEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ dialogId: string; title?: string }>;
      const { dialogId, title: dialogTitle } = customEvent.detail;
      const message = dialogTitle ? `"${dialogTitle}" (${dialogId})` : `Dialog (${dialogId})`;

      switch (customEvent.type) {
        case DIALOG_EVENTS.OPENED:
          toast.info(`${message} opened.`);
          break;
        case DIALOG_EVENTS.CLOSED:
          toast.info(`${message} closed.`);
          break;
        case DIALOG_EVENTS.MINIMIZED:
          toast.info(`${message} minimized.`);
          break;
        case DIALOG_EVENTS.RESTORED:
          toast.info(`${message} restored.`);
          break;
        case DIALOG_EVENTS.EXPANDED:
          toast.info(`${message} expanded.`);
          break;
        case DIALOG_EVENTS.CONTRACTED:
          toast.info(`${message} contracted.`);
          break;
        case DIALOG_EVENTS.FOCUSED:
          toast.info(`${message} focused.`);
          break;
        default:
          break;
      }
    };

    // Add event listeners
    window.addEventListener(DIALOG_EVENTS.OPENED, handleDialogEvent);
    window.addEventListener(DIALOG_EVENTS.CLOSED, handleDialogEvent);
    window.addEventListener(DIALOG_EVENTS.MINIMIZED, handleDialogEvent);
    window.addEventListener(DIALOG_EVENTS.RESTORED, handleDialogEvent);
    window.addEventListener(DIALOG_EVENTS.EXPANDED, handleDialogEvent);
    window.addEventListener(DIALOG_EVENTS.CONTRACTED, handleDialogEvent);
    window.addEventListener(DIALOG_EVENTS.FOCUSED, handleDialogEvent);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener(DIALOG_EVENTS.OPENED, handleDialogEvent);
      window.removeEventListener(DIALOG_EVENTS.CLOSED, handleDialogEvent);
      window.removeEventListener(DIALOG_EVENTS.MINIMIZED, handleDialogEvent);
      window.removeEventListener(DIALOG_EVENTS.RESTORED, handleDialogEvent);
      window.removeEventListener(DIALOG_EVENTS.EXPANDED, handleDialogEvent);
      window.removeEventListener(DIALOG_EVENTS.CONTRACTED, handleDialogEvent);
      window.removeEventListener(DIALOG_EVENTS.FOCUSED, handleDialogEvent);
    };
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