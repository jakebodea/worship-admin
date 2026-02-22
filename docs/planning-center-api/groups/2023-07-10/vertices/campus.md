# Campus

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `campus`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/campus`
- Resource path: `https://api.planningcenteronline.com/groups/v2/campuses`
- Collection only: `no`
- Deprecated: `no`


## Description

A campus as defined in Planning Center Accounts


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | The name of the campus | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| group-campus-groups | groups | groups which have applied this campus |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-group-campuses | campuses | campuses assigned this group |
| campus-organization-campuses | campuses | campuses for this organization |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
