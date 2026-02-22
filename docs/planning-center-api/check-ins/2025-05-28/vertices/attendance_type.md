# AttendanceType

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `attendance_type`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/attendance_type`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/events/{event_id}/attendance_types`
- Collection only: `no`
- Deprecated: `no`


## Description

A kind of attendee which is tracked by _headcount_, not by check-in.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| color | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| limit | integer (e.g. 1) | - | public |
| name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-attendancetype-event | event | - |
| headcount-attendancetype-headcounts | headcounts | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attendancetype-event-attendance_types | attendance_types | - |
| attendancetype-headcount-attendance_type | attendance_type | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
