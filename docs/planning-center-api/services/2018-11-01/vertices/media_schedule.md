# MediaSchedule

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `media_schedule`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/media_schedule`
- Resource path: `https://api.planningcenteronline.com/services/v2/media/{media_id}/media_schedules`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| plan_dates | string (e.g. string) | - | public |
| plan_short_dates | string (e.g. string) | - | public |
| plan_sort_date | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| service_type_name | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| plan | plan | - |
| service_type | service_type | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| mediaschedule-media-media_schedules | media_schedules | - |
