# TeamLeader

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `team_leader`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/team_leader`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/team_leaders`
- Collection only: `no`
- Deprecated: `no`


## Description

A leader of a specific Team in a Service Type.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| send_responses_for_accepts | boolean (e.g. True) | - | public |
| send_responses_for_blockouts | boolean (e.g. True) | - | public |
| send_responses_for_declines | boolean (e.g. True) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| team | team | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-teamleader-people | people | - |
| team-teamleader-team | team | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| teamleader-person-team_leaders | team_leaders | - |
| teamleader-team-team_leaders | team_leaders | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | people | include associated people |
|  | team | include associated team |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
