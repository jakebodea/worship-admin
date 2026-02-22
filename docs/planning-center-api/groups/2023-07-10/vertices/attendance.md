# Attendance

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `attendance`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/attendance`
- Resource path: `https://api.planningcenteronline.com/groups/v2/events/{event_id}/attendances`
- Collection only: `yes`
- Deprecated: `no`


## Description

Individual event attendance for a person.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| attended | boolean (e.g. True) | Whether or not the person attended the event. | public |
| id | primary_key (e.g. primary_key) | - | public |
| role | string (e.g. value) | The role of the person at the time of event.   Possible values: `member`, `leader`, `visitor`, or `applicant` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| event | event | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-attendance-person | person | person belonging to this attendance |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attendance-event-attendances | attendances | attendances recorded for this event |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
|  | role | prefix with a hyphen (-role) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | role | Query on a specific role  Possible values: `member`, `leader`, `visitor`, or `applicant` |
