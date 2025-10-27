"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface DialogEventBadgeProps {
  children: React.ReactNode;
}

const DialogEventBadge: React.FC<DialogEventBadgeProps> = ({ children }) => {
  return (
    <Badge className="bg-muted-darker-20 text-white hover:bg-muted-darker-20/80">
      {children}
    </Badge>
  );
};

export default DialogEventBadge;