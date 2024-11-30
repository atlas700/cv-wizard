"use client";

import React, { useRef, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TabsListComponent() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const tabs = [
    "Tab 1",
    "Tab 2",
    "Tab 3",
    "Tab 4",
    "Tab 5",
    "Tab 6",
    "Tab 7",
    "Tab 8",
    "Tab 9",
  ];

  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      const handleScroll = () => {
        setShowLeftArrow(tabsElement.scrollLeft > 0);
        setShowRightArrow(
          tabsElement.scrollLeft <
            tabsElement.scrollWidth - tabsElement.clientWidth
        );
      };

      tabsElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial state

      // Check if overflow exists
      setShowRightArrow(tabsElement.scrollWidth > tabsElement.clientWidth);

      return () => tabsElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      const scrollAmount = tabsElement.clientWidth / 2;
      tabsElement.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Tabs defaultValue="Tab 1" className="w-full relative">
      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div ref={tabsRef} className="overflow-x-auto scrollbar-hide">
          <TabsList className="inline-flex w-max border-b pb-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* TabsContent components would go here */}
    </Tabs>
  );
}
