# Episode

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `episode`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/episode`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/episodes`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| art | hash (e.g. {}) | - | public |
| church_center_url | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| description | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| library_audio_url | string (e.g. string) | - | public |
| library_streaming_service | string (e.g. value) | Possible values: `vimeo`, `youtube`, `livestream_com`, `resi`, `facebook`, or `boxcast` | public |
| library_video_embed_code | string (e.g. string) | - | public |
| library_video_thumbnail_url | string (e.g. string) | - | public |
| library_video_url | string (e.g. string) | - | public |
| needs_library_audio_or_video_url | boolean (e.g. True) | - | public |
| needs_notes_template | boolean (e.g. True) | - | public |
| needs_video_url | boolean (e.g. True) | - | public |
| page_actions | array (e.g. []) | - | public |
| published_live_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| published_to_library_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| sermon_audio | hash (e.g. {}) | - | public |
| services_plan_remote_identifier | string (e.g. string) | The id for the associated Services Plan (https://developer.planning.center/docs/#/apps/services/2018-08-01/vertices/plan) | public |
| services_service_type_remote_identifier | string (e.g. string) | The id for the associated Services Service Type (https://developer.planning.center/docs/#/apps/services/2018-08-01/vertices/service_type) | public |
| stream_type | string (e.g. value) | Possible values: `channel_default_livestream`, `livestream`, or `prerecorded` | public |
| streaming_service | string (e.g. value) | Possible values: `vimeo`, `youtube`, `livestream_com`, `resi`, `facebook`, or `boxcast` | public |
| title | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| video_embed_code | string (e.g. string) | - | public |
| video_thumbnail_url | string (e.g. string) | - | public |
| video_url | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| series | series | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| channel-episode-channel | channel | - |
| episoderesource-episode-episode_resources | episode_resources | - |
| episodetime-episode-episode_times | episode_times | - |
| notetemplate-episode-note_template | note_template | - |
| series-episode-series | series | - |
| speakership-episode-speakerships | speakerships | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| episode-channel-current_episode | current_episode | - |
| episode-channel-episodes | episodes | - |
| episode-organization-episodes | episodes | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | channel | include associated channel |
|  | episode_resources | include associated episode_resources |
|  | episode_times | include associated episode_times |
|  | series | include associated series |
|  | speakerships | include associated speakerships |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | published_live_at | prefix with a hyphen (-published_live_at) to reverse the order |
|  | published_to_library_at | prefix with a hyphen (-published_to_library_at) to reverse the order |
|  | stream_type | prefix with a hyphen (-stream_type) to reverse the order |
|  | title | prefix with a hyphen (-title) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | series_id | Query on a related series |
|  | services_plan_remote_identifier | Query on a specific services_plan_remote_identifier |
|  | services_service_type_remote_identifier | Query on a specific services_service_type_remote_identifier |
