# SongSchedule

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `song_schedule`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/song_schedule`
- Resource path: `https://api.planningcenteronline.com/services/v2/songs/{song_id}/song_schedules`
- Collection only: `no`
- Deprecated: `no`


## Description

A upcoming schedule for a song


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| arrangement_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| key_name | string (e.g. string) | - | public |
| plan_dates | string (e.g. string) | - | public |
| plan_sort_date | string (e.g. string) | - | public |
| plan_visible | boolean (e.g. True) | - | public |
| service_type_name | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| arrangement | arrangement | - |
| key | key | - |
| plan | plan | - |
| service_type | service_type | - |
| item | item | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| songschedule-song-song_schedules | song_schedules | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | plan_sort_date | prefix with a hyphen (-plan_sort_date) to reverse the order |
