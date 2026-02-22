# CheckInTime

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `check_in_time`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/check_in_time`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/check_ins/{check_in_id}/check_in_times`
- Collection only: `no`
- Deprecated: `no`


## Description

A CheckInTime combines an EventTime and a Location, and associates it with
the parent CheckIn.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| alerts | array (e.g. []) | - | station |
| has_validated | boolean (e.g. True) | - | station |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. string) | - | public |
| services_integrated | boolean (e.g. True) | - | station |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event_time | event_time | - |
| location | location | - |
| check_in | check_in | - |
| pre_check | pre_check | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkintime-checkin-check_in_times | check_in_times | - |
