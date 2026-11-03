import Link from "next/link";
import { getData } from "@/lib/data";
import TeamForm from "@/components/admin/TeamForm";
export default async function NewTeam() {
  const d = await getData();
  return (
    <>
      <Link className="back-link" href="/teams">
        Back to teams
      </Link>
      <div className="page-heading">
        <h1>Create team</h1>
      </div>
      <TeamForm students={d.students} />
    </>
  );
}
