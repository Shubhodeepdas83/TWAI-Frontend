"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Search, BookOpen, Clock, User } from "lucide-react";

export default function RightSection() {
  return (
    <div className="border rounded-lg p-4 flex flex-col h-[600px]">
      {/* Buttons Section */}
      <div className="flex flex-col gap-2 mb-4">
        <Button variant="ghost" className="flex items-center gap-2 text-sm">
          <BookOpen className="w-4 h-4" />
          Fact Checking
        </Button>

        <Button variant="ghost" className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          Summarize till now
        </Button>

        <Button variant="ghost" className="flex items-center gap-2 text-sm">
          <Search className="w-4 h-4" />
          What I missed
        </Button>

        <Button variant="ghost" className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          Explain like a 5-year-old
        </Button>
      </div>

      {/* Spacer to push checkboxes to bottom */}
      <div className="flex-1"></div>

      {/* Checkboxes Section */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox />
          Enable Web search
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox />
          Show Graph
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox />
          Query Image
        </label>
      </div>
    </div>
  );
}
