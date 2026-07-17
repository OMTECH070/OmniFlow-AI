"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useChatStore } from "@/hooks/useChat";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function SettingsPage() {
  const user = useChatStore((s) => s.user);
  const setUser = useChatStore((s) => s.setUser);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUser({ name: name.trim() || user.name, role: role.trim() || user.role });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6">
        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-text-primary">Profile</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-text-secondary">Display name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-[13.5px] text-text-primary outline-none focus:ring-2 focus:ring-accent-end/40"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-text-secondary">Workspace label</span>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-[13.5px] text-text-primary outline-none focus:ring-2 focus:ring-accent-end/40"
              />
            </label>
            <div className="flex items-center gap-3">
              <Button size="md" onClick={handleSave}>
                Save changes
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-[12.5px] text-accent-end">
                  <Check className="h-3.5 w-3.5" /> Saved
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}