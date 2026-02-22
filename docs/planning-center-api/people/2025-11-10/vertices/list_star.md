# ListStar

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `list_star`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/list_star`
- Resource path: `https://api.planningcenteronline.com/people/v2/lists/{list_id}/star`
- Collection only: `no`
- Deprecated: `no`


## Description

A starred list for a person indicates it is special in some way


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| liststar-list-star | star | - |
