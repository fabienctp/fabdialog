"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Ajout de cet import
import { ScrollArea } from "@/components/ui/scroll-area"; // Ajout de cet import
import { Separator } from "@/components/ui/separator"; // Ajout de cet import

interface DialogEvent {
  id: string;
  type: string;
  timestamp: string;
  dialogId: string;
  title?: string;
}

const EventLog: React.FC = () => {
  const [events, setEvents] = useState<DialogEvent[]>([]);

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ dialogId: string; title?: string }>;
      const { dialogId, title } = customEvent.detail;
      const newEvent: DialogEvent = {
        id: `${dialogId}-${customEvent.type}-${Date.now()}`,
        type: customEvent.type.replace('dialog:', '').toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        dialogId,
        title,
      };
      setEvents((prevEvents) => [newEvent, ...prevEvents].slice(0, 10)); // Keep last 10 events
    };

    // Listen to all dialog events
    const dialogEventTypes = [
      "dialog:opened",
      "dialog:closed",
      "dialog:minimized",
      "dialog:restored",
      "dialog:expanded",
      "dialog:contracted",
      "dialog:focused",
    ];

    dialogEventTypes.forEach((eventType) => {
      window.addEventListener(eventType, handleEvent);
    });

    return () => {
      dialogEventTypes.forEach((eventType) => {
        window.removeEventListener(eventType, handleEvent);
      });
    };
  }, []);

  return (
    <Card className="w-full h-64 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Journal des événements de dialogue</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {events.length === 0 ? (
            <p className="text-sm text- p-4">Aucun événement de dialogue récent.</p>
          ) : (
            <div className="space-y-2 p-4">
              {events.map((event) => (
                <div key={event.id} className="text-sm">
                  <p>
                    <span className="font-semibold text-primary">{event.timestamp}</span> -{" "}
                    <span className="font-medium">{event.type}</span>: Dialog{" "}
                    <span className="text-">({event.title || event.dialogId})</span>
                  </p>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EventLog;