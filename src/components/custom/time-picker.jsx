'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Clock, X } from "lucide-react";
import Select from "@/components/custom/select";

export default function TimePicker({ value, onChange, disabled = false }) {
  const [time, setTime] = React.useState(value || null);

  React.useEffect(() => {
    setTime(value);
  }, [value]);

  // Hours in AM/PM format
  const hours = [...Array(12).keys()].map((h) => ({
    label: String(h === 0 ? 12 : h).padStart(2, "0"),
    value: String(h === 0 ? 12 : h),  // string
  }));

  const minutes = [...Array(60).keys()].map((m) => ({
    label: m.toString().padStart(2, "0"),
    value: String(m),  // string
  }));

  const meridiem = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];

  // Convert 24-hour time → AM/PM UI state
  const getUIState = () => {
    if (!time) return { hour: null, minute: null, ampm: "AM" };

    let hour = time.getHours();
    const minute = time.getMinutes();

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert to 1–12

    return { hour, minute, ampm };
  };

  const ui = getUIState();

  const updateTime = (newHour, newMinute, newAmpm) => {
    const date = time ? new Date(time) : new Date();

    let hour = newHour !== null ? newHour : ui.hour;
    let minute = newMinute !== null ? newMinute : ui.minute;
    let ampm = newAmpm || ui.ampm;

    // convert back to 24-hour format
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    date.setHours(hour);
    date.setMinutes(minute ?? 0);
    date.setSeconds(0);

    setTime(date);
    onChange(date);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setTime(null);
    onChange(null);
  };

  const formatted = time
    ? `${String(ui.hour).padStart(2, "0")}:${String(ui.minute).padStart(
      2,
      "0"
    )} ${ui.ampm}`
    : "Select time";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button variant="outline" className="w-full justify-start" disabled={disabled}>
            <Clock className="mr-2 h-4 w-4" />
            {formatted}
          </Button>

          {time && !disabled && (
            <Button
              type="button"
              variant="dim"
              size="sm"
              onClick={handleReset}
              className="absolute top-1/2 -end-0 -translate-y-1/2"
            >
              <X />
            </Button>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[260px] p-3">
        <div className="grid grid-cols-3 gap-3">

          {/* HOURS */}
          <div>
            <label className="text-xs text-muted-foreground">Hour</label>
            <Select
              options={hours}
              defaultValue={String(ui.hour)}
              onChange={(opt) => updateTime(Number(opt?.value), null, null)}
              disabled={disabled}
            />
          </div>

          {/* MINUTES */}
          <div>
            <label className="text-xs text-muted-foreground">Minute</label>
            <Select
              options={minutes}
              defaultValue={String(ui.minute)}
              onChange={(opt) => updateTime(null, Number(opt?.value), null)}
              disabled={disabled}
            />
          </div>

          {/* AM / PM */}
          <div>
            <label className="text-xs text-muted-foreground">AM/PM</label>
            <Select
              options={meridiem}
              defaultValue={ui.ampm}
              placeholder="AM/PM"
              enableSearch={false}
              onChange={(opt) => updateTime(null, null, opt?.value)}
              disabled={disabled}
            />
          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
}
