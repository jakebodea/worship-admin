# LiveController

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `live_controller`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/live_controller`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/live_controllers`
- Collection only: `no`
- Deprecated: `no`


## Description

A person who can control Services LIVE without the required permissions


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| full_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| photo_thumbnail_url | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| livecontroller-servicetype-live_controllers | live_controllers | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
