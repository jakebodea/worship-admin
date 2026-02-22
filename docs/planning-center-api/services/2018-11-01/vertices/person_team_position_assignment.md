# PersonTeamPositionAssignment

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `person_team_position_assignment`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/person_team_position_assignment`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/team_positions/{team_position_id}/person_team_position_assignments`
- Collection only: `no`
- Deprecated: `no`


## Description

A person's assignment to a position within a team.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| preferred_weeks | array (e.g. []) | When `schedule_preference` is set to "Choose Weeks" then this indicates which weeks are preferred (checked).  e.g. ['1', '3', '5'] to prefer odd numbered weeks. | public |
| schedule_preference | string (e.g. string) | Possible Values:   "Every week"   "Every other week"   "Every 3rd week"   "Every 4th week"   "Every 5th week"   "Every 6th week"   "Once a month"   "Twice a month"   "Three times a month"   "Choose Weeks" | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| team_position | team_position | - |
| time_preference_options | time_preference_options | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-personteampositionassignment-person | person | - |
| teamposition-personteampositionassignment-team_position | team_position | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| personteampositionassignment-person-person_team_position_assignments | person_team_position_assignments | - |
| personteampositionassignment-team-person_team_position_assignments | person_team_position_assignments | - |
| personteampositionassignment-teamposition-person_team_position_assignments | person_team_position_assignments | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |
|  | team_position | include associated team_position |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
