# Attendance

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `attendance`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/attendance`
- Resource path: `https://api.planningcenteronline.com/services/v2/series/{series_id}/plans/{plan_id}/attendances`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| check_ins_event_id | primary_key (e.g. primary_key) | - | public |
| check_ins_event_period_id | primary_key (e.g. primary_key) | - | public |
| checked_in_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| plan_time | plan_time | - |
| plan_person | plan_person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attendance-plan-attendances | attendances | - |
