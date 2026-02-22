# Event

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `event`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/event`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/events`
- Collection only: `no`
- Deprecated: `no`


## Description

An event.

May contain information such as who owns
the event, visibility on Church Center and a public-facing summary.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| approval_status | string (e.g. string) | Possible values: - `A`: approved. - `P`: pending. - `R`: rejected. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the event was created | public |
| description | string (e.g. string) | A rich text public-facing summary of the event | public |
| featured | boolean (e.g. True) | - `true` indicates the event is featured on Church Center - `false` indicates the event is not featured on Church Center | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the event | public |
| image_url | string (e.g. string) | Path to where the event image is stored | public |
| name | string (e.g. string) | The name of the event | public |
| percent_approved | integer (e.g. 1) | Calculated by taking the sum of the `percent_approved` for all future `ReservationBlocks` and dividing that by the `count` of all future `ReservationBlocks`.  If there are no future `ReservationBlocks`, returns `100` | public |
| percent_rejected | integer (e.g. 1) | Calculated by taking the sum of the `percent_rejected` for all future `ReservationBlocks` and dividing that by the `count` of all future `ReservationBlocks`.  If there are no future `ReservationBlocks`, returns `0` | public |
| registration_url | string (e.g. string) | The registration URL for the event | public |
| summary | string (e.g. string) | A plain text public-facing summary of the event | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the event was updated | public |
| visible_in_church_center | boolean (e.g. True) | - `true` indicates the event Church Center visibility is set to 'Published' - `false` indicates the event Church Center visibility is set to 'Hidden' | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| calendar | calendar | - |
| owner | owner | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-event-attachments | attachments | - |
| conflict-event-conflicts | conflicts | - |
| eventconnection-event-event_connections | event_connections | - |
| eventinstance-event-event_instances | event_instances | - |
| eventresourcerequest-event-event_resource_requests | event_resource_requests | - |
| feed-event-feed | feed | - |
| person-event-owner | owner | - |
| resourcebooking-event-resource_bookings | resource_bookings | - |
| tag-event-tags | tags | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-attachment-event | event | - |
| event-conflict-winner | winner | - |
| event-eventinstance-event | event | - |
| event-eventresourcerequest-event | event | - |
| event-eventtime-event | event | - |
| event-organization-events | events | - |
| event-tag-events | events | - |
| event-taggroup-events | events | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | attachments | include associated attachments |
|  | feed | include associated feed |
|  | owner | include associated owner |
|  | tags | include associated tags |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | approval_status | Query on a specific approval_status |
|  | created_at | Query on a specific created_at |
|  | featured | Query on a specific featured |
|  | name | Query on a specific name |
|  | percent_approved | Query on a specific percent_approved |
|  | percent_rejected | Query on a specific percent_rejected |
|  | updated_at | Query on a specific updated_at |
|  | visible_in_church_center | Query on a specific visible_in_church_center |
