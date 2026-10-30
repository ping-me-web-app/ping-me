"use client";

import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h2 className="font-display font-bold text-3xl mb-2">
        <FormattedMessage id="notFound.title" />
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        <FormattedMessage id="notFound.desc" />
      </p>
      <Link href="/">
        <Button variant="primary">
          <FormattedMessage id="notFound.returnHome" />
        </Button>
      </Link>
    </div>
  );
}
