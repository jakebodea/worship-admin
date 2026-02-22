# Zoom

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `zoom`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/zoom`
- Resource path: `https://api.planningcenteronline.com/services/v2/media/{media_id}/attachments/{attachment_id}/zooms`
- Collection only: `no`
- Deprecated: `no`


## Description

Describes a zoom level for an attachment


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| aspect_ratio | float (e.g. 1.42) | The aspect ratio of the device this zoom is for. It is rounded to the nearest 3 decimal places. | public |
| id | primary_key (e.g. primary_key) | - | public |
| x_offset | float (e.g. 1.42) | The percentage of the document's width the zoomed document should be offset by horizontally. | public |
| y_offset | float (e.g. 1.42) | The percentage of the document's height the zoomed document should be offset by vertically. | public |
| zoom_level | float (e.g. 1.42) | The percentage of the zoom. Must be a value between 1.0 and 5.0 | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| attachable | attachable | - |
| attachment | attachment | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| zoom-attachment-zooms | zooms | - |
