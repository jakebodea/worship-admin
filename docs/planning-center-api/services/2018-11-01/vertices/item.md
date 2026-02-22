# Item

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `item`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/item`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/plans/{plan_id}/items`
- Collection only: `no`
- Deprecated: `no`


## Description

An item in a plan.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| custom_arrangement_sequence | array (e.g. []) | An array of strings containing a label and a number describing the section:  ['Verse 1', 'Chorus 1', 'Verse 2'] | public |
| custom_arrangement_sequence_full | array (e.g. []) | - | public |
| custom_arrangement_sequence_short | array (e.g. []) | - | public |
| description | string (e.g. string) | - | public |
| html_details | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| item_type | string (e.g. string) | There are 4 possible values:  - `song`: The item is a song  - `header`: The item is a header  - `media`: The item is a piece of media  - `item`: The default item type  This value can only be set when an item is created. The only value that you can pass is `header`. If no value is passed then `item` will be used. To create a media item you'll attach a video media to the item, and to create a song item, you'll attach a song. | public |
| key_name | string (e.g. string) | - | public |
| length | integer (e.g. 1) | - | public |
| sequence | integer (e.g. 1) | - | public |
| service_position | string (e.g. string) | There are 3 possible values:  - `pre`: the item happens before the service starts  - `post`: the item happens after the service ends  - `during`: the item happens during the service | public |
| title | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| plan | plan | - |
| song | song | - |
| arrangement | arrangement | - |
| key | key | - |
| selected_layout | selected_layout | - |
| selected_background | selected_background | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| arrangement-item-arrangement | arrangement | - |
| attachment-item-attachments | attachments | - |
| customslide-item-custom_slides | custom_slides | - |
| itemnote-item-item_notes | item_notes | - |
| itemtime-item-item_times | item_times | - |
| key-item-key | key | - |
| media-item-media | media | - |
| attachment-item-selected_attachment | selected_attachment | - |
| attachment-item-selected_background | selected_background | - |
| song-item-song | song | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| item-live-items | items | - |
| item-plan-items | items | - |
| item-plantemplate-items | items | - |
| item-song-last_scheduled_item | last_scheduled_item | The Song's most recently scheduled Item in a given Service Type. Requires a `service_type` query parameter. e.g. `?service_type=789` |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | arrangement | include associated arrangement |
|  | item_notes | include associated item_notes |
|  | item_times | include associated item_times |
|  | key | include associated key |
|  | media | include associated media |
|  | selected_attachment | include associated selected_attachment |
|  | song | include associated song |
