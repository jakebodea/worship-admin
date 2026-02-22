# EventResourceRequest

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `event_resource_request`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/event_resource_request`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/event_resource_requests`
- Collection only: `no`
- Deprecated: `no`


## Description

A room or resource request for a specific event.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| approval_sent | boolean (e.g. True) | Whether or not an email has been sent to request approval | public |
| approval_status | string (e.g. string) | Possible values: - `A`: approved - `P`: pending - `R`: rejected | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which request was created | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the request | public |
| notes | string (e.g. string) | Additional information about the room or resource request | public |
| quantity | integer (e.g. 1) | How many of the rooms or resources are being requested | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which request was updated | public |
| visible_on_kiosks | boolean (e.g. True) | Whether this resource request is visible on kiosks | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |
| resource | resource | - |
| event_resource_request | event_resource_request | - |
| created_by | created_by | - |
| updated_by | updated_by | - |
| room_setup | room_setup | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventresourceanswer-eventresourcerequest-answers | answers | - |
| person-eventresourcerequest-created_by | created_by | - |
| event-eventresourcerequest-event | event | - |
| resourcebooking-eventresourcerequest-resource_bookings | resource_bookings | - |
| resource-eventresourcerequest-resource | resource | - |
| roomsetup-eventresourcerequest-room_setup | room_setup | - |
| person-eventresourcerequest-updated_by | updated_by | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventresourcerequest-event-event_resource_requests | event_resource_requests | - |
| eventresourcerequest-organization-event_resource_requests | event_resource_requests | - |
| eventresourcerequest-person-event_resource_requests | event_resource_requests | - |
| eventresourcerequest-resourceapprovalgroup-event_resource_requests | event_resource_requests | - |
| eventresourcerequest-resourcebooking-event_resource_request | event_resource_request | - |
| eventresourcerequest-resource-event_resource_requests | event_resource_requests | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_by | include associated created_by |
|  | event | include associated event |
|  | resource | include associated resource |
|  | room_setup | include associated room_setup |
|  | updated_by | include associated updated_by |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | approval_sent | Query on a specific approval_sent |
|  | approval_status | Query on a specific approval_status |
|  | created_at | Query on a specific created_at |
|  | updated_at | Query on a specific updated_at |
