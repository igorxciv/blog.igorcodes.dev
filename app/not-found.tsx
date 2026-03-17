import type { Metadata } from "next";
import { NotFoundPage } from "@/components/blog/not-found-page";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GlobalNotFoundPage() {
  return <NotFoundPage />;
}
