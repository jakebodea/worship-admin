# PlanTime

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `plan_time`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/plan_time`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plan_times`
- Collection only: `no`
- Deprecated: `no`


## Description

A time in a plan.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | Planned end time. | public |
| id | primary_key (e.g. primary_key) | - | public |
| live_ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | End time as recorded by Services LIVE. | public |
| live_starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | Start time as recorded by Services LIVE. | public |
| name | string (e.g. string) | - | public |
| recorded | boolean (e.g. True) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | Planned start time. | public |
| team_reminders | array (e.g. []) | A Hash that maps a Team ID to a reminder value. If nothing is specified, no reminder is set for that team. A reminder value is an integer (0-7) equal to the number of days before the selected time a reminder should be sent. | public |
| time_type | string (e.g. string) | Possible values are:  - rehearsal  - service  - other | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| assigned_teams | assigned_teams | - |
| assigned_positions | assigned_positions | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| splitteamrehearsalassignment-plantime-split_team_rehearsal_assignments | split_team_rehearsal_assignments | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| plantime-neededposition-time | time | - |
| plantime-planperson-declined_plan_times | declined_plan_times | - |
| plantime-planperson-plan_times | plan_times | - |
| plantime-plan-plan_times | plan_times | - |
| plantime-schedule-declined_plan_times | declined_plan_times | - |
| plantime-schedule-plan_times | plan_times | - |
| plantime-servicetype-plan_times | plan_times | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | split_team_rehearsal_assignments | include associated split_team_rehearsal_assignments |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | time_type | Query on a specific time_type |
