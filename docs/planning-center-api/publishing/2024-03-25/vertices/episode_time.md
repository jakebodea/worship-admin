# EpisodeTime

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `episode_time`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/episode_time`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/episodes/{episode_id}/episode_times`
- Collection only: `no`
- Deprecated: `no`


## Description

Live schedule times for an Episode


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| caveats | array (e.g. []) | - | public |
| current_state | string (e.g. string) | Possible values: `upcoming`, `active`, `over` | public |
| current_timestamp | float (e.g. 1.42) | - | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| streaming_service | string (e.g. string) | Possible values: `vimeo`, `youtube`, `livestream_com`, `resi`, `facebook`, `boxcast` | public |
| video_embed_code | string (e.g. string) | - | public |
| video_url | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| episodetime-episode-episode_times | episode_times | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |
