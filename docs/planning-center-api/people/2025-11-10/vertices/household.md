# Household

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `household`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/household`
- Resource path: `https://api.planningcenteronline.com/people/v2/households`
- Collection only: `no`
- Deprecated: `no`


## Description

A household links people together and can have a primary contact. To add a person to an existing household, use the HouseholdMemberships endpoint.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| avatar | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| member_count | integer (e.g. 1) | - | public |
| name | string (e.g. string) | - | public |
| primary_contact_id | primary_key (e.g. primary_key) | - | public |
| primary_contact_name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| primary_contact | primary_contact | - |
| people | people | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| householdmembership-household-household_memberships | household_memberships | - |
| person-household-people | people | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| household-householdmembership-household | household | - |
| household-organization-households | households | - |
| household-peopleimporthistory-household | household | - |
| household-person-households | households | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | people | include associated people |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | member_count | prefix with a hyphen (-member_count) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | primary_contact_name | prefix with a hyphen (-primary_contact_name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | member_count | Query on a specific member_count |
|  | name | Query on a specific name |
|  | primary_contact_name | Query on a specific primary_contact_name |
|  | updated_at | Query on a specific updated_at |
