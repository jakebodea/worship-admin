# Channel

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `channel`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/channel`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/channels`
- Collection only: `no`
- Deprecated: `no`


## Description

A collection of sermons


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| activate_episode_minutes_before | integer (e.g. 1) | The activation time for an episode, expressed in minutes before its start | public |
| art | hash (e.g. {}) | - | public |
| can_enable_chat | boolean (e.g. True) | - | public |
| church_center_url | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| default_video_duration | integer (e.g. 1) | - | public |
| default_video_embed_code | string (e.g. string) | - | public |
| default_video_url | string (e.g. string) | - | public |
| description | string (e.g. string) | - | public |
| enable_audio | boolean (e.g. True) | - | public |
| enable_on_demand_video | boolean (e.g. True) | - | public |
| enable_watch_live | boolean (e.g. True) | - | public |
| general_chat_enabled | boolean (e.g. True) | - | public |
| group_chat_enabled | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| podcast_art | hash (e.g. {}) | - | public |
| podcast_feed_url | string (e.g. string) | - | public |
| podcast_settings | hash (e.g. {}) | - | public |
| position | integer (e.g. 1) | - | public |
| published | boolean (e.g. True) | - | public |
| sermon_notes_enabled | boolean (e.g. True) | - | public |
| services_service_type_remote_identifier | string (e.g. string) | The id for the associated Services Service Type (https://developer.planning.center/docs/#/apps/services/2018-08-01/vertices/service_type) | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| url | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| channeldefaultepisoderesource-channel-channel_default_episode_resources | channel_default_episode_resources | - |
| channeldefaulttime-channel-channel_default_times | channel_default_times | - |
| episode-channel-current_episode | current_episode | - |
| episode-channel-episodes | episodes | - |
| channelnexttime-channel-next_times | next_times | - |
| series-channel-series | series | - |
| episodestatistics-channel-statistics | statistics | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| channel-episode-channel | channel | - |
| channel-organization-channels | channels | - |
| channel-series-channel | channel | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | channel_default_episode_resources | include associated channel_default_episode_resources |
|  | channel_default_times | include associated channel_default_times |
|  | current_episode | include associated current_episode |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | position | prefix with a hyphen (-position) to reverse the order |
