// app/search/page.js

import { Suspense } from "react";
import SearchPageContent from "@/app/search/SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  );
}
