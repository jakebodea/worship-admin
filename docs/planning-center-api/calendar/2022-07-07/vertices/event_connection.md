# EventConnection

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `event_connection`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/event_connection`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/events/{event_id}/event_connections`
- Collection only: `no`
- Deprecated: `no`


## Description

A connection between a Calendar event and a record in another product


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| connected_to_id | primary_key (e.g. primary_key) | Unique identifier for the connected record | public |
| connected_to_name | string (e.g. string) | Name of the record that the event is connected to | public |
| connected_to_type | string (e.g. string) | Currently we support `signup`, `group`, `event`, and `service_type` | public |
| connected_to_url | string (e.g. string) | A link to the connected record | public |
| id | primary_key (e.g. primary_key) | - | public |
| product_name | string (e.g. string) | Currently we support `registrations`, `groups`, `check-ins`, and `services` | public |
| promoted | boolean (e.g. True) | Whether this connection is promoted for display (only applies to Groups connections)  Only available when requested with the `?fields` param | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventconnection-event-event_connections | event_connections | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | connected_to_id | Query on a specific connected_to_id |
|  | product_name | Query on a specific product_name |
|  | promoted | Query on a specific promoted |
