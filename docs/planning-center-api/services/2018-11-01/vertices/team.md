# Team

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `team`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/team`
- Resource path: `https://api.planningcenteronline.com/services/v2/teams`
- Collection only: `no`
- Deprecated: `no`


## Description

A Team within a Service Type.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| archived_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| assigned_directly | boolean (e.g. True) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| default_prepare_notifications | boolean (e.g. True) | - | public |
| default_status | string (e.g. string) | - | public |
| deleted_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_plan_from | string (e.g. string) | - | public |
| name | string (e.g. string) | - | public |
| rehearsal_team | boolean (e.g. True) | - | public |
| schedule_to | string (e.g. string) | This determines whether a team is a split team or not.Accepted values: 1. "plan" (default) 2. "time" (designates as a split team) | public |
| secure_team | boolean (e.g. True) | - | public |
| sequence | integer (e.g. 1) | - | public |
| stage_color | string (e.g. string) | - | public |
| stage_variant | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| viewers_see | integer (e.g. 1) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| service_type | service_type | - |
| default_responds_to | default_responds_to | - |
| service_types | service_types | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-team-people | people | - |
| personteampositionassignment-team-person_team_position_assignments | person_team_position_assignments | - |
| servicetype-team-service_types | service_types | - |
| teamleader-team-team_leaders | team_leaders | - |
| teamposition-team-team_positions | team_positions | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| team-neededposition-team | team | - |
| team-organization-teams | teams | - |
| team-planperson-team | team | - |
| team-plan-signup_teams | signup_teams | - |
| team-schedule-team | team | - |
| team-servicetype-teams | teams | - |
| team-splitteamrehearsalassignment-team | team | - |
| team-teamleader-team | team | - |
| team-teamposition-team | team | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | people | include associated people |
|  | person_team_position_assignments | include associated person_team_position_assignments |
|  | service_types | include associated service_types |
|  | team_leaders | include associated team_leaders |
|  | team_positions | include associated team_positions |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | Query on a specific name |
