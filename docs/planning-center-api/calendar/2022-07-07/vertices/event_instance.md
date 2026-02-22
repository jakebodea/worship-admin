# EventInstance

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `event_instance`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/event_instance`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/event_instances`
- Collection only: `no`
- Deprecated: `no`


## Description

A specific occurrence of an event.

If the event is recurring, `recurrence` will be set and
`recurrence_description` will provide an overview of the recurrence pattern.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| all_day_event | boolean (e.g. True) | Indicates whether event instance lasts all day | public |
| church_center_url | string (e.g. string) | The URL for the event on Church Center | public |
| compact_recurrence_description | string (e.g. string) | Compact representation of event instance's recurrence pattern | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the event instance was created | public |
| description | string (e.g. string) | A rich text public-facing summary of the event  Only available when requested with the `?fields` param | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the event instance ends | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the event instance | public |
| image_url | string (e.g. string) | Path to where the event image is stored  Only available when requested with the `?fields` param | public |
| location | string (e.g. string) | Representation of where the event instance takes place | public |
| name | string (e.g. string) | Name of event. Can be overridden for specific instances | public |
| published_ends_at | string (e.g. string) | Publicly visible end time | public |
| published_starts_at | string (e.g. string) | Publicly visible start time | public |
| recurrence | string (e.g. string) | For a recurring event instance, the interval of how often the event instance occurs | public |
| recurrence_description | string (e.g. string) | Longer description of the event instance's recurrence pattern | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the event instance starts | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the event instance was updated | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-eventinstance-event | event | - |
| eventtime-eventinstance-event_times | event_times | - |
| resourcebooking-eventinstance-resource_bookings | resource_bookings | - |
| tag-eventinstance-tags | tags | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventinstance-event-event_instances | event_instances | - |
| eventinstance-organization-event_instances | event_instances | - |
| eventinstance-resourcebooking-event_instance | event_instance | - |
| eventinstance-tag-event_instances | event_instances | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |
|  | event_times | include associated event_times |
|  | resource_bookings | include associated resource_bookings |
|  | tags | include associated tags |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | ends_at | prefix with a hyphen (-ends_at) to reverse the order |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | ends_at | Query on a specific ends_at |
|  | starts_at | Query on a specific starts_at |
|  | updated_at | Query on a specific updated_at |
