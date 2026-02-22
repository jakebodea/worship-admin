# LocationLabel

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `location_label`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/location_label`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/labels/{label_id}/location_labels`
- Collection only: `no`
- Deprecated: `no`


## Description

Says how many of a given label to print for this location and
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
| label-locationlabel-label | label | - |
| location-locationlabel-location | location | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| locationlabel-label-location_labels | location_labels | - |
| locationlabel-location-location_labels | location_labels | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | label | include associated label |
|  | location | include associated location |
