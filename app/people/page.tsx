import { PeoplePage } from "@/components/people/people-page";
import { peoplePageFlag } from "@/flags";
import { notFound } from "next/navigation";

export default async function PeopleRoute() {
  if (!(await peoplePageFlag())) notFound();

  return <PeoplePage />;
}
