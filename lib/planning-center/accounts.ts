export type PlanningCenterAccount = {
  id: string;
  accountId: string;
  providerId: string;
  updatedAt: string | Date;
  identity: {
    sub: string | null;
    name: string | null;
    email: string | null;
    organizationId: string | null;
    organizationName: string | null;
  } | null;
};

export type PlanningCenterAccountsResponse = {
  session: {
    userId: string;
    name: string;
    email: string;
    image: string | null;
  };
  selectedAccountId: string | null;
  accounts: PlanningCenterAccount[];
};

export type DeletePlanningCenterAccountResponse = {
  success: boolean;
  deletedAccountId: string;
  selectedAccountId: string | null;
  remainingAccountCount: number;
};
