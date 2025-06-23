"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { IntoleranceSelection } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function IntolerancesInput({
  selected,
  onChange,
  suggestions,
}: {
  selected: IntoleranceSelection[];
  onChange: (newList: IntoleranceSelection[]) => void;
  suggestions: IntoleranceSelection[];
}) {
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = (suggestions ?? []).filter(
    (intol) =>
      intol.label.toLowerCase().includes(query.toLowerCase()) &&
      !selected.find((s) => s.id === intol.id)
  );

  const addIntolerance = (intol: IntoleranceSelection) => {
    if (!selected.find(i => i.id === intol.id)) {
        onChange([...selected, intol]);
        setQuery("");
    }
  };

  const remove = (id: string) => {
    onChange(selected.filter((i) => i.id !== id));
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [selected]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Intolérances alimentaires (optionnel)</label>

      <div className="relative border rounded-lg p-2">
        <div
          ref={containerRef}
          className="flex items-center gap-2 flex-wrap md:flex-nowrap overflow-x-auto scrollbar-hide px-1"
        >
          {selected.map((intol) => (
            <Badge
              key={intol.id}
              className="flex items-center gap-1 whitespace-nowrap bg-gray-100 text-primary"
            >
              {intol.label}
                <button
                type="button"
                onClick={() => {
                    remove(intol.id);
                }}
                className="ml-1 cursor-pointer p-1 rounded"
                >
                    <X size={14} />
                </button>
            </Badge>
          ))}

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Backspace" && query === "" && selected.length > 0) {
                remove(selected[selected.length - 1].id);
            }
            }}
            placeholder="Ajouter une intolérance"
            className="border-0 outline-none flex-1 min-w-[150px] py-1"
          />
        </div>

        {query && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 border bg-white rounded-lg shadow max-h-48 overflow-auto">
            {filtered.map((intol) => (
              <div
                key={intol.id}
                onClick={() => addIntolerance(intol)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {intol.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
