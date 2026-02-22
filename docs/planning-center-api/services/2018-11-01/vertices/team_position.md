# TeamPosition

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `team_position`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/team_position`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/team_positions`
- Collection only: `no`
- Deprecated: `no`


## Description

A position within a team.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| negative_tag_groups | array (e.g. []) | If the Team is assigned via tags, these are Tags where the option "None" is specified. | public |
| sequence | integer (e.g. 1) | - | public |
| tag_groups | array (e.g. []) | If the Team is assigned via tags, these are Tags where the option "Any" is specified. | public |
| tags | array (e.g. []) | If the Team is assigned via tags, these are specific Tags that are specified. | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| team | team | - |
| attachment_types | attachment_types | - |
| tags | tags | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| personteampositionassignment-teamposition-person_team_position_assignments | person_team_position_assignments | - |
| tag-teamposition-tags | tags | - |
| team-teamposition-team | team | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| teamposition-personteampositionassignment-team_position | team_position | - |
| teamposition-servicetype-team_positions | team_positions | - |
| teamposition-team-team_positions | team_positions | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | tags | include associated tags |
|  | team | include associated team |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
