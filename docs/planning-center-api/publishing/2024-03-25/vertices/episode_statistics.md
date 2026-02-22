# EpisodeStatistics

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `episode_statistics`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/episode_statistics`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/channels/{channel_id}/statistics`
- Collection only: `no`
- Deprecated: `no`


## Description

Viewership statistics for an episode


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| library_watch_count | boolean (e.g. True) | - | public |
| live_watch_count | boolean (e.g. True) | - | public |
| published_live_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| published_to_library_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| times | array (e.g. []) | `watch_count` per EpisodeTime | public |
| title | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| episodestatistics-channel-statistics | statistics | - |
