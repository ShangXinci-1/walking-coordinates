import { JourneyExplorer } from "../../components/routes/JourneyExplorer";
import { SiteFooter, SiteHeader } from "../shared";

export default function JourneyPage() {
  return (
    <main className="journey-page">
      <SiteHeader />
      <JourneyExplorer />
      <SiteFooter />
    </main>
  );
}
