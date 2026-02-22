# ItemTime

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `item_time`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/item_time`
- Resource path: `https://api.planningcenteronline.com/services/v2/songs/{song_id}/last_scheduled_item/{last_scheduled_item_id}/item_times`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| exclude | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| length | integer (e.g. 1) | - | public |
| length_offset | integer (e.g. 1) | - | public |
| live_end_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| live_start_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| item | item | - |
| plan_time | plan_time | - |
| plan | plan | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| itemtime-item-item_times | item_times | - |
| itemtime-live-current_item_time | current_item_time | - |
| itemtime-live-next_item_time | next_item_time | - |
