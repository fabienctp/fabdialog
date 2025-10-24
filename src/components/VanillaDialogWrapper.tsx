"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@my-app/core"; // Import from your new vanilla TS library

interface VanillaDialogWrapperProps {
  title: string;
  content: string;
}

const VanillaDialogWrapper: React.FC<VanillaDialogWrapperProps> = ({ title, content }) => {
  const dialogInstanceRef = useRef<Dialog | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    if (dialogInstanceRef.current) {
      dialogInstanceRef.current.close(); // Close any existing instance before opening a new one
    }
    dialogInstanceRef.current = new Dialog({
      title,
      content,
      onClose: () => setIsOpen(false),
    });
    dialogInstanceRef.current.render();
    setIsOpen(true);
  };

  const closeDialog = () => {
    dialogInstanceRef.current?.close();
    setIsOpen(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      dialogInstanceRef.current?.close();
    };
  }, []);

  return (
    <div>
      <Button onClick={openDialog}>Open Vanilla Dialog</Button>
      {isOpen && (
        <p className="mt-2 text-sm text-gray-500">Dialog is open (check the page for the actual dialog)</p>
      )}
    </div>
  );
};

export default VanillaDialogWrapper;