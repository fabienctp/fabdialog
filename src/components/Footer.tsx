"use client";

import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted text-muted-foreground p-4 text-center shadow-inner mt-auto">
      <div className="container mx-auto">
        <p className="text-sm mb-2">&copy; {new Date().getFullYear()} Mon App Dyad. Tous droits réservés.</p>
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;