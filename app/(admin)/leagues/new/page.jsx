import Link from "next/link";
import { getData } from "@/lib/data";
import LeagueForm from "@/components/admin/LeagueForm";
export default async function NewLeague() {
  const d = await getData();
  return (
    <>
      <Link className="back-link" href="/leagues">
        Back to leagues
      </Link>
      <div className="page-heading">
        <h1>Create league</h1>
      </div>
      <LeagueForm teams={d.teams} />
    </>
  );
}
