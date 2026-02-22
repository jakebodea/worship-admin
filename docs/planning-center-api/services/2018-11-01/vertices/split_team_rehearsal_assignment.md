# SplitTeamRehearsalAssignment

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `split_team_rehearsal_assignment`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/split_team_rehearsal_assignment`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plan_times/{plan_time_id}/split_team_rehearsal_assignments`
- Collection only: `no`
- Deprecated: `no`


## Description

For Rehearsal/Other Times, maps a Split Team to selected Time Preference Options. For example, used to assign 8am Ushers to 7:30am call time, and 11am Ushers to 10:30am call time.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| schedule_special_service_times | boolean (e.g. True) | Controls if the related rehearsal/other time is assigned when a person is scheduled to a split team service time that does not match a Time Preference Option | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| team | team | - |
| time_preference_options | time_preference_options | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| team-splitteamrehearsalassignment-team | team | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| splitteamrehearsalassignment-plantime-split_team_rehearsal_assignments | split_team_rehearsal_assignments | - |
