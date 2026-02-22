# EventTime

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `event_time`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/event_time`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/event_instances/{event_instance_id}/event_times`
- Collection only: `yes`
- Deprecated: `no`


## Description

Start and end times for each event instance.

In the Calendar UI, these are represented under the "Schedule" section and
may include "Setup" and "Teardown" times for the instance.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the event time ends | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the event time | public |
| name | date_time (e.g. 2000-01-01T12:00:00Z) | Name of the event time | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the event time starts | public |
| visible_on_kiosks | boolean (e.g. True) | Set to `true` if the time is visible on kiosk | public |
| visible_on_widget_and_ical | boolean (e.g. True) | Set to `true` if the time is visible on widget or iCal | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-eventtime-event | event | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventtime-eventinstance-event_times | event_times | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ends_at | prefix with a hyphen (-ends_at) to reverse the order |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ends_at | Query on a specific ends_at |
|  | name | Query on a specific name |
|  | starts_at | Query on a specific starts_at |
|  | visible_on_kiosks | Query on a specific visible_on_kiosks |
|  | visible_on_widget_and_ical | Query on a specific visible_on_widget_and_ical |
