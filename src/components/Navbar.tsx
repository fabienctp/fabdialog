"use client";

import React from "react";
import { Home, BookOpenText, PlayCircle } from "lucide-react"; // Import PlayCircle icon
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle"; // Import ThemeToggle

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          FabDialog
        </Link>
        <div className="flex items-center space-x-4"> {/* Use flex to align items */}
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Accueil
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/#dialog-manager-section"> {/* Link to the section ID */}
              <PlayCircle className="mr-2 h-4 w-4" /> Tester FabDialog
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/documentation">
              <BookOpenText className="mr-2 h-4 w-4" /> Documentation
            </Link>
          </Button>
          <ThemeToggle /> {/* Add the ThemeToggle component */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;