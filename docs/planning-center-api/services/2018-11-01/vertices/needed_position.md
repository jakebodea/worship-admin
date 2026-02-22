# NeededPosition

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `needed_position`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/needed_position`
- Resource path: `https://api.planningcenteronline.com/services/v2/series/{series_id}/plans/{plan_id}/needed_positions`
- Collection only: `no`
- Deprecated: `no`


## Description

An amount of unfilled positions needed within a team in a plan.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| quantity | integer (e.g. 1) | - | public |
| scheduled_to | string (e.g. string) | - | public |
| team_position_name | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| team | team | - |
| plan | plan | - |
| time | time | - |
| time_preference_option | time_preference_option | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| team-neededposition-team | team | - |
| plantime-neededposition-time | time | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| neededposition-plan-needed_positions | needed_positions | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | team | include associated team |
|  | time | include associated time |
