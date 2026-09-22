import Link from "next/link";

import { Headphones } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportCard() {
  return (
    <Card
      size="sm"
      className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden border-primary/15 bg-primary/5"
    >
      <CardHeader className="min-w-0 px-4">
        <div className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-primary" />
          <CardTitle className="truncate text-sm">HR Helpdesk & Support</CardTitle>
        </div>
        <CardDescription className="line-clamp-3 text-xs">
          Questions regarding policies, attendance or time-off? Contact{" "}
          <Link href="mailto:hr@company.com" className="font-medium text-foreground hover:underline">
            People Operations
          </Link>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
