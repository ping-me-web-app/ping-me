import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h2 className="font-display font-bold text-3xl mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 mb-6">The requested page could not be found.</p>
      <Link href="/">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
}
