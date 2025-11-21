import { ContaminationImpactCard } from "../components/ContaminationImpactCard";

export function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <ContaminationImpactCard />
    </div>
  );
}
