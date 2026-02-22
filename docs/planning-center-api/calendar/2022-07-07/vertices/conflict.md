# Conflict

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `conflict`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/conflict`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/conflicts`
- Collection only: `no`
- Deprecated: `no`


## Description

A conflict between two events caused by overlapping event resource
requests.

If the conflict has been resolved, `resolved_at` will be present.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the conflict was created | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the conflict | public |
| note | string (e.g. string) | Additional information about the conflict or resolution | public |
| resolved_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the conflict was resolved | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the conflict was updated | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| resource | resource | - |
| resolved_by | resolved_by | - |
| winner | winner | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-conflict-resolved_by | resolved_by | - |
| resource-conflict-resource | resource | - |
| event-conflict-winner | winner | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| conflict-event-conflicts | conflicts | - |
| conflict-organization-conflicts | conflicts | - |
| conflict-resource-conflicts | conflicts | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | resolved_by | include associated resolved_by |
|  | resource | include associated resource |
|  | winner | include associated winner |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | resolved_at | prefix with a hyphen (-resolved_at) to reverse the order |
