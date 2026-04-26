"use client";

import { useState } from "react"; // useEffect ki zarurat nahi hai ab
import { Menu } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet"; 
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";

export default function MobileHeader() {
  const [open, setOpen] = useState(false); // Drawer ki state

  return (
    <header className="flex items-center justify-between border-b px-4 py-3 md:hidden bg-slate-950 text-white">
      <span className="text-lg font-bold tracking-tight">SmartCRM</span>
      
      {/* open aur onOpenChange ka use karein */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="p-0 w-72 border-none bg-slate-950 text-white">
          <div className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main navigation sidebar</SheetDescription>
          </div>

          {/* onClose ka function pass kar rahe hain */}
          <Sidebar onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}