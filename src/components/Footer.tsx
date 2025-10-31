"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground p-4 text-center shadow-inner mt-auto">
      <div className="container mx-auto">
        <p className="text-sm mb-2">&copy; {new Date().getFullYear()} FabDialog. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;