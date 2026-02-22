# PersonEvent

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `person_event`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/person_event`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/events/{event_id}/person_events`
- Collection only: `no`
- Deprecated: `no`


## Description

Counts a person's attendence for a given event.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| check_in_count | integer (e.g. 1) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-personevent-event | event | - |
| checkin-personevent-first_check_in | first_check_in | - |
| checkin-personevent-last_check_in | last_check_in | - |
| person-personevent-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| personevent-event-person_events | person_events | - |
| personevent-person-person_events | person_events | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |
|  | first_check_in | include associated first_check_in |
|  | last_check_in | include associated last_check_in |
|  | person | include associated person |
