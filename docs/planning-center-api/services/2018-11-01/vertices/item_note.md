# ItemNote

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `item_note`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/item_note`
- Resource path: `https://api.planningcenteronline.com/services/v2/songs/{song_id}/last_scheduled_item/{last_scheduled_item_id}/item_notes`
- Collection only: `no`
- Deprecated: `no`


## Description

A plan item note that belongs to a category.

Note: You can only assign the category on create. If you want to change category; delete the current note, and create a new one passing in the `item_note_category_id` then.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| category_name | string (e.g. string) | - | public |
| content | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| item_note_category | item_note_category | - |
| item | item | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| itemnotecategory-itemnote-item_note_category | item_note_category | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| itemnote-item-item_notes | item_notes | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | item_note_category | include associated item_note_category |
