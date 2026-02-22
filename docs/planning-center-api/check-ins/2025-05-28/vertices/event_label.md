# EventLabel

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `event_label`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/event_label`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/events/{event_id}/event_labels`
- Collection only: `no`
- Deprecated: `no`


## Description

Says how many of a given label to print for this event and
whether to print it for regulars, guests, and/or volunteers.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| for_guest | boolean (e.g. True) | - | public |
| for_regular | boolean (e.g. True) | - | public |
| for_volunteer | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| quantity | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-eventlabel-event | event | - |
| label-eventlabel-label | label | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventlabel-event-event_labels | event_labels | - |
| eventlabel-label-event_labels | event_labels | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |
|  | label | include associated label |
