# Rule

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `rule`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/rule`
- Resource path: `https://api.planningcenteronline.com/people/v2/lists/{list_id}/rules`
- Collection only: `no`
- Deprecated: `no`


## Description

A rule belongs to a List and groups conditions together.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| subset | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| condition-rule-conditions | conditions | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| rule-list-rules | rules | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | conditions | include associated conditions |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | subset | prefix with a hyphen (-subset) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | subset | Query on a specific subset |
|  | updated_at | Query on a specific updated_at |
