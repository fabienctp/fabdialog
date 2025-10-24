"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@my-app/core"; // Import from your new vanilla TS library

interface VanillaDialogWrapperProps {
  title: string;
  content: string;
}

const VanillaDialogWrapper: React.FC<VanillaDialogWrapperProps> = ({ title, content }) => {
  const [openDialogs, setOpenDialogs] = useState<Dialog[]>([]);

  const openNewDialog = () => {
    const newDialog = new Dialog({
      title: `${title} #${openDialogs.length + 1}`,
      content: `${content} This is dialog number ${openDialogs.length + 1}.`,
      onClose: () => {
        setOpenDialogs((prevDialogs) => prevDialogs.filter((d) => d.id !== newDialog.id));
      },
    });
    newDialog.render();
    setOpenDialogs((prevDialogs) => [...prevDialogs, newDialog]);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={openNewDialog}>Open New Vanilla Dialog</Button>
      {openDialogs.length > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          {openDialogs.length} dialog(s) open. Click on a dialog to bring it to front.
        </p>
      )}
    </div>
  );
};

export default VanillaDialogWrapper;