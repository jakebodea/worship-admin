# Headcount

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `headcount`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/headcount`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/headcounts`
- Collection only: `no`
- Deprecated: `no`


## Description

A tally of attendees for a given event time and attendance type.
If one does not exist, the count may have been zero.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| total | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event_time | event_time | - |
| attendance_type | attendance_type | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attendancetype-headcount-attendance_type | attendance_type | - |
| eventtime-headcount-event_time | event_time | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| headcount-attendancetype-headcounts | headcounts | - |
| headcount-eventtime-headcounts | headcounts | - |
| headcount-organization-headcounts | headcounts | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | attendance_type | include associated attendance_type |
|  | event_time | include associated event_time |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | total | prefix with a hyphen (-total) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | updated_at | Query on a specific updated_at |
