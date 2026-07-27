import { Suspense } from "react";
import { JourneyExplorer } from "../../components/routes/JourneyExplorer";
import { SiteFooter, SiteHeader } from "../shared";

export default function JourneyPage() {
  return (
    <main className="journey-page">
      <SiteHeader />
      <Suspense fallback={<div className="journey-page__fallback" />}>
        <JourneyExplorer />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
