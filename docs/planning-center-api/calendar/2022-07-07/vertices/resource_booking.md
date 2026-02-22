# ResourceBooking

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `resource_booking`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/resource_booking`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/resource_bookings`
- Collection only: `no`
- Deprecated: `no`


## Description

A specific booking of a room or resource for an event instance.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the booking was created | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which usage of the booked room or resource ends | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the booking | public |
| quantity | integer (e.g. 1) | The quantity of the rooms or resources booked | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which usage of the booked room or resource starts | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the booking was updated | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |
| event_instance | event_instance | - |
| resource | resource | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventinstance-resourcebooking-event_instance | event_instance | - |
| eventresourcerequest-resourcebooking-event_resource_request | event_resource_request | - |
| resource-resourcebooking-resource | resource | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resourcebooking-eventinstance-resource_bookings | resource_bookings | - |
| resourcebooking-event-resource_bookings | resource_bookings | - |
| resourcebooking-eventresourcerequest-resource_bookings | resource_bookings | - |
| resourcebooking-organization-resource_bookings | resource_bookings | - |
| resourcebooking-resource-resource_bookings | resource_bookings | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event_instance | include associated event_instance |
|  | event_resource_request | include associated event_resource_request |
|  | resource | include associated resource |


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
