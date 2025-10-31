"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"; // Import cn utility for merging classes

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        // Appliquer des classes Tailwind directes pour le fond, le texte et la bordure
        className={cn(
          "bg-white text-gray-900 border border-gray-200", // Styles pour le mode clair
          "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700" // Styles pour le mode sombre avec meilleur contraste
        )}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "hover:bg-gray-100 hover:text-gray-900", // Styles pour le mode clair
            "dark:hover:bg-gray-700 dark:hover:text-gray-100" // Styles pour le mode sombre avec meilleur contraste
          )}
        >
          Clair
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "hover:bg-gray-100 hover:text-gray-900", // Styles pour le mode clair
            "dark:hover:bg-gray-700 dark:hover:text-gray-100" // Styles pour le mode sombre avec meilleur contraste
          )}
        >
          Sombre
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "hover:bg-gray-100 hover:text-gray-900", // Styles pour le mode clair
            "dark:hover:bg-gray-700 dark:hover:text-gray-100" // Styles pour le mode sombre avec meilleur contraste
          )}
        >
          Système
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}