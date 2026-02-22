# ServiceTime

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `service_time`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/service_time`
- Resource path: `https://api.planningcenteronline.com/people/v2/campuses/{campus_id}/service_times`
- Collection only: `no`
- Deprecated: `no`


## Description

A ServiceTime Resource


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| day | string (e.g. value) | Possible values: `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, or `saturday` | public |
| description | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| start_time | integer (e.g. 1) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| organization | organization | - |
| campus | campus | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| servicetime-campus-service_times | service_times | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | time | prefix with a hyphen (-time) to reverse the order |
