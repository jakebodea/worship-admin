# ListResult

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `list_result`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/list_result`
- Resource path: `https://api.planningcenteronline.com/people/v2/lists/{list_id}/list_results`
- Collection only: `no`
- Deprecated: `no`


## Description

A list result


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| list | list | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| listresult-list-list_results | list_results | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
