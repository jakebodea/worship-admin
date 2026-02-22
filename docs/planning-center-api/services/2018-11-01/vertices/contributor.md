# Contributor

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `contributor`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/contributor`
- Resource path: `https://api.planningcenteronline.com/services/v2/series/{series_id}/plans/{plan_id}/contributors`
- Collection only: `no`
- Deprecated: `no`


## Description

A Contributor Resource


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| contributable_action | string (e.g. string) | - | public |
| contributable_category | string (e.g. string) | - | public |
| contributable_type | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| full_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| photo_thumbnail_url | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| plan | plan | - |
| person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| contributor-plan-contributors | contributors | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
