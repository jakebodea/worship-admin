# CheckIn

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `check_in`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/check_in`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/check_ins`
- Collection only: `no`
- Deprecated: `no`


## Description

An attendance record for an event.

If someone was checked out, `checked_out_at` will be present.

You can scope check-ins in a few ways:

- `regular`s, `guest`s, and `volunteer`s correspond to the option selected when checking in.
- `attendee`s are `regular`s and `guest`s together.
- `one_time_guest`s are check-ins which were created without a corresponding person record.
- `not_one_time_guest`s are check-ins which had a corresponding person record when they were created.
- `checked_out` are check-ins where `checked_out_at` is present (meaning they were checked out from a station).
- `first_time`s are check-ins which are the person's first for a given event. (Label-only visitors are not included here.)


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| checked_out_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| confirmed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| emergency_contact_name | string (e.g. string) | - | public |
| emergency_contact_phone_number | string (e.g. string) | - | public |
| first_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. string) | - | public |
| last_name | string (e.g. string) | - | public |
| medical_notes | string (e.g. string) | - | public |
| number | integer (e.g. 1) | - | public |
| one_time_guest | boolean (e.g. True) | - | public |
| security_code | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event_period | event_period | - |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkingroup-checkin-check_in_group | check_in_group | - |
| checkintime-checkin-check_in_times | check_in_times | - |
| station-checkin-checked_in_at | checked_in_at | - |
| person-checkin-checked_in_by | checked_in_by | - |
| person-checkin-checked_out_by | checked_out_by | - |
| event-checkin-event | event | - |
| eventperiod-checkin-event_period | event_period | - |
| eventtime-checkin-event_times | event_times | - |
| location-checkin-locations | locations | - |
| option-checkin-options | options | - |
| person-checkin-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkin-checkingroup-check_ins | check_ins | - |
| checkin-event-check_ins | check_ins | - |
| checkin-eventperiod-check_ins | check_ins | - |
| checkin-eventtime-check_ins | check_ins | - |
| checkin-location-check_ins | check_ins | - |
| checkin-locationeventperiod-check_ins | check_ins | - |
| checkin-locationeventtime-check_ins | check_ins | - |
| checkin-option-check_ins | check_ins | - |
| checkin-organization-check_ins | check_ins | - |
| checkin-person-check_ins | check_ins | - |
| checkin-personevent-first_check_in | first_check_in | - |
| checkin-personevent-last_check_in | last_check_in | - |
| checkin-station-checked_in_at_check_ins | checked_in_at_check_ins | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | check_in_times | include associated check_in_times |
|  | checked_in_at | include associated checked_in_at |
|  | checked_in_by | include associated checked_in_by |
|  | checked_out_by | include associated checked_out_by |
|  | event | include associated event |
|  | event_period | include associated event_period |
|  | event_times | include associated event_times |
|  | locations | include associated locations |
|  | options | include associated options |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | checked_out_at | prefix with a hyphen (-checked_out_at) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
|  | number | prefix with a hyphen (-number) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | account_center_person_id | Query on a related person |
|  | created_at | Query on a specific created_at |
|  | security_code | Query on a specific security_code |
|  | updated_at | Query on a specific updated_at |
