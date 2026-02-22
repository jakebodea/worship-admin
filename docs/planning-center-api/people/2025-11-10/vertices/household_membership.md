# HouseholdMembership

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `household_membership`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/household_membership`
- Resource path: `https://api.planningcenteronline.com/people/v2/households/{household_id}/household_memberships`
- Collection only: `no`
- Deprecated: `no`


## Description

A household membership is the linking record between a household and a person.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| household_role | string (e.g. string) | The role of the person within the household. Possible values are: `adult`, `child_or_dependent`, `other_adult`or`parent_guardian`. | public |
| id | primary_key (e.g. primary_key) | - | public |
| pending | boolean (e.g. True) | False when a person's membership in a household is unverified. | public |
| person_name | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| household-householdmembership-household | household | - |
| person-householdmembership-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| householdmembership-household-household_memberships | household_memberships | - |
| householdmembership-person-household_memberships | household_memberships | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | household | include associated household |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | pending | prefix with a hyphen (-pending) to reverse the order |
|  | person_name | prefix with a hyphen (-person_name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | pending | Query on a specific pending |
|  | person_name | Query on a specific person_name |
