import { planningCenterPeopleService } from "@/lib/planning-center/services/people-service";
import { findIncluded } from "@/lib/planning-center/utils";
import type {
  PCResource,
  RawPerson,
  RawPlanPerson,
  RawTeam,
} from "@/lib/types";

export type PlanRosterStatus = "confirmed" | "pending" | "declined";

export interface PlanRosterPerson {
  id: string;
  name: string;
  photoThumbnailUrl: string | null;
  rawPerson?: RawPerson;
}

export interface PlanRosterEntry {
  planPersonId: string;
  personId: string | null;
  person?: PlanRosterPerson;
  teamId: string | null;
  teamName: string | null;
  positionName: string;
  label: string;
  status: PlanRosterStatus;
  rawStatus: string;
  /** Services `plan_person.decline_reason` when present. */
  declineReason?: string | null;
}

export interface PlanSchedulingContext {
  serviceTypeId: string;
  planId: string;
  rosterEntries: PlanRosterEntry[];
  rosterByPersonId: Map<string, PlanRosterEntry[]>;
  rosterBySlotKey: Map<string, PlanRosterEntry[]>;
  peopleById: Map<string, RawPerson>;
}

interface Params {
  serviceTypeId: string;
  planId: string;
}

export async function getPlanSchedulingContext({
  serviceTypeId,
  planId,
}: Params): Promise<PlanSchedulingContext> {
  const response = await planningCenterPeopleService.getPlanTeamMembers(
    serviceTypeId,
    planId
  );
  return buildPlanSchedulingContext({
    serviceTypeId,
    planId,
    planTeamMembers: response.data as RawPlanPerson[],
    included: response.included || [],
  });
}

export function buildPlanSchedulingContext({
  serviceTypeId,
  planId,
  planTeamMembers,
  included,
}: Params & {
  planTeamMembers: RawPlanPerson[];
  included: PCResource[];
}): PlanSchedulingContext {
  const peopleById = buildRawPeopleMap(included);
  const rosterEntries = planTeamMembers
    .map((member) => normalizeRosterEntry(member, included, peopleById))
    .filter((entry): entry is PlanRosterEntry => !!entry);
  const rosterByPersonId = new Map<string, PlanRosterEntry[]>();
  const rosterBySlotKey = new Map<string, PlanRosterEntry[]>();

  for (const entry of rosterEntries) {
    if (entry.personId) {
      const existing = rosterByPersonId.get(entry.personId) || [];
      existing.push(entry);
      rosterByPersonId.set(entry.personId, existing);
    }

    if (entry.teamId) {
      const key = buildSlotKey(entry.teamId, entry.positionName);
      const existing = rosterBySlotKey.get(key) || [];
      existing.push(entry);
      rosterBySlotKey.set(key, existing);
    }
  }

  return {
    serviceTypeId,
    planId,
    rosterEntries,
    rosterByPersonId,
    rosterBySlotKey,
    peopleById,
  };
}

export function emptyPlanSchedulingContext(
  serviceTypeId: string,
  planId: string
): PlanSchedulingContext {
  return {
    serviceTypeId,
    planId,
    rosterEntries: [],
    rosterByPersonId: new Map(),
    rosterBySlotKey: new Map(),
    peopleById: new Map(),
  };
}

export function buildSlotKey(teamId: string, positionName: string): string {
  return `${teamId}::${normalizePositionName(positionName)}`;
}

export function getRosterEntriesForSlot(
  context: PlanSchedulingContext,
  teamId: string | undefined,
  positionName: string | undefined
): PlanRosterEntry[] {
  if (!teamId || !positionName) return [];
  return context.rosterBySlotKey.get(buildSlotKey(teamId, positionName)) || [];
}

export function getRosterEntriesForPerson(
  context: PlanSchedulingContext,
  personId: string
): PlanRosterEntry[] {
  return context.rosterByPersonId.get(personId) || [];
}

export function getRosterPerson(
  context: PlanSchedulingContext,
  personId: string
): RawPerson | undefined {
  return context.peopleById.get(personId);
}

export function isDeclinedRosterStatus(status: PlanRosterStatus): boolean {
  return status === "declined";
}

function normalizeRosterEntry(
  member: RawPlanPerson,
  included: PCResource[],
  peopleById: Map<string, RawPerson>
): PlanRosterEntry | null {
  const rawPositionName = (member.attributes.team_position_name || "").trim();
  if (!rawPositionName) return null;

  const status = classifyRosterStatus(member.attributes.status);
  const parsed = parseTeamAndPosition(rawPositionName);
  const relationshipTeamId = getRelationshipId(member.relationships?.team?.data);
  const parsedTeamId = parsed?.teamName
    ? findTeamIdByName(included, parsed.teamName)
    : null;
  const teamId = relationshipTeamId || parsedTeamId;
  const teamName = getTeamName(included, teamId) || parsed?.teamName || null;
  const positionName = parsed?.positionName || rawPositionName;
  const personId = getRelationshipId(member.relationships?.person?.data);
  const rawPerson = personId ? peopleById.get(personId) : undefined;
  const person = personId
    ? {
        id: personId,
        name: rawPerson ? getPersonName(rawPerson) : "Unknown person",
        photoThumbnailUrl: rawPerson?.attributes.photo_thumbnail_url ?? null,
        rawPerson,
      }
    : undefined;

  return {
    planPersonId: member.id,
    personId,
    person,
    teamId,
    teamName,
    positionName,
    label: teamName ? `${teamName} - ${positionName}` : positionName,
    status,
    rawStatus: (member.attributes.status || "").toString(),
    declineReason: normalizeDeclineReason(member.attributes.decline_reason),
  };
}

function normalizeDeclineReason(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  return t.length > 0 ? t : null;
}

function classifyRosterStatus(rawStatus: string | undefined): PlanRosterStatus {
  const status = (rawStatus || "").trim().toLowerCase();
  if (status === "c" || status === "confirmed") return "confirmed";
  if (
    status === "d" ||
    status.includes("declined") ||
    status.includes("removed")
  ) {
    return "declined";
  }
  return "pending";
}

function buildRawPeopleMap(included: PCResource[]): Map<string, RawPerson> {
  const result = new Map<string, RawPerson>();
  for (const resource of included) {
    if (resource.type === "Person") {
      result.set(resource.id, resource as RawPerson);
    }
  }
  return result;
}

function getPersonName(person: RawPerson): string {
  const firstName = (person.attributes.first_name || "").trim();
  const lastName = (person.attributes.last_name || "").trim();
  return [firstName, lastName].filter(Boolean).join(" ").trim() || "Unknown person";
}

function getTeamName(included: PCResource[], teamId: string | null): string | null {
  if (!teamId) return null;
  const team = findIncluded(included, "Team", teamId) as RawTeam | undefined;
  return ((team?.attributes.name as string | undefined) || "").trim() || null;
}

function findTeamIdByName(included: PCResource[], teamName: string): string | null {
  const normalized = teamName.trim().toLowerCase();
  if (!normalized) return null;

  const team = included.find((resource) => {
    if (resource.type !== "Team") return false;
    const rawTeam = resource as RawTeam;
    return ((rawTeam.attributes.name as string | undefined) || "").trim().toLowerCase() === normalized;
  });

  return team?.id || null;
}

function parseTeamAndPosition(
  teamPositionName: string
): { teamName: string; positionName: string } | null {
  if (!teamPositionName.includes(" - ")) return null;
  const parts = teamPositionName.split(" - ");
  const teamName = (parts[0] || "").trim();
  const positionName = parts.slice(1).join(" - ").trim();
  if (!teamName || !positionName) return null;
  return { teamName, positionName };
}

function getRelationshipId(
  data: { id: string } | { id: string }[] | null | undefined
): string | null {
  if (!data || Array.isArray(data)) return null;
  return data.id || null;
}

function normalizePositionName(positionName: string): string {
  return positionName.trim().toLowerCase();
}
