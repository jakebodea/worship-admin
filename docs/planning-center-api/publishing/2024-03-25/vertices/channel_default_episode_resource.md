# ChannelDefaultEpisodeResource

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `channel_default_episode_resource`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/channel_default_episode_resource`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/channels/{channel_id}/channel_default_episode_resources`
- Collection only: `no`
- Deprecated: `no`


## Description

The default EpisodeResources for a Channel


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| featured | boolean (e.g. True) | - | public |
| icon | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. string) | Possible values: `giving_fund`, `people_form`, `generic_url`, `services_public_page` | public |
| position | integer (e.g. 1) | - | public |
| title | string (e.g. string) | - | public |
| type | string (e.g. string) | - | public |
| url | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| channeldefaultepisoderesource-channel-channel_default_episode_resources | channel_default_episode_resources | - |
