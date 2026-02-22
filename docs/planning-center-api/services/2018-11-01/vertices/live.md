# Live

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `live`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/live`
- Resource path: `https://api.planningcenteronline.com/services/v2/series/{series_id}/plans/{plan_id}/live`
- Collection only: `no`
- Deprecated: `no`


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| go_to_next_item | https://api.planningcenteronline.com/services/v2/series/{series_id}/plans/{plan_id}/live/{live_id}/go_to_next_item | - | - | no |
| go_to_previous_item | https://api.planningcenteronline.com/services/v2/series/{series_id}/plans/{plan_id}/live/{live_id}/go_to_previous_item | - | - | no |
| toggle_control | https://api.planningcenteronline.com/services/v2/series/{series_id}/plans/{plan_id}/live/{live_id}/toggle_control | - | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| can_chat | boolean (e.g. True) | - | public |
| can_control | boolean (e.g. True) | - | public |
| can_control_video_feed | boolean (e.g. True) | - | public |
| can_take_control | boolean (e.g. True) | - | public |
| chat_room_channel | string (e.g. string) | - | public |
| dates | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| live_channel | string (e.g. string) | - | public |
| series_title | string (e.g. string) | - | public |
| title | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-live-controller | controller | - |
| itemtime-live-current_item_time | current_item_time | - |
| item-live-items | items | - |
| itemtime-live-next_item_time | next_item_time | - |
| servicetype-live-service_type | service_type | - |
| plan-live-watchable_plans | watchable_plans | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| live-plan-live | live | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | controller | include associated controller |
|  | current_item_time | include associated current_item_time |
|  | items | include associated items |
|  | next_item_time | include associated next_item_time |
|  | service_type | include associated service_type |
