"use client";

import React from "react";
import { Home, BookOpenText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          FabDialog
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Accueil
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/documentation">
              <BookOpenText className="mr-2 h-4 w-4" /> Documentation
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;