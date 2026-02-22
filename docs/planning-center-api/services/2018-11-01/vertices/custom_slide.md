# CustomSlide

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `custom_slide`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/custom_slide`
- Resource path: `https://api.planningcenteronline.com/services/v2/songs/{song_id}/last_scheduled_item/{last_scheduled_item_id}/custom_slides`
- Collection only: `no`
- Deprecated: `no`


## Description

A CustomSlide is used for adding text intended for display on a screen.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| body | string (e.g. string) | - | public |
| enabled | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| label | string (e.g. string) | - | public |
| order | integer (e.g. 1) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| item | item | - |
| attachment | attachment | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| customslide-item-custom_slides | custom_slides | - |
