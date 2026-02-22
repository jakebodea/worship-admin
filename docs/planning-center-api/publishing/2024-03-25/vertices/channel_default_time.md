# ChannelDefaultTime

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `channel_default_time`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/channel_default_time`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/channels/{channel_id}/channel_default_times`
- Collection only: `no`
- Deprecated: `no`


## Description

The default times for a channel


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| day_of_week | integer (e.g. 1) | The day of the week. 0 is Sunday, 1 is Monday, etc. | public |
| frequency | string (e.g. string) | Possible values: `weekly` | public |
| hour | integer (e.g. 1) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| minute | integer (e.g. 1) | - | public |
| position | integer (e.g. 1) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| channeldefaulttime-channel-channel_default_times | channel_default_times | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | position | prefix with a hyphen (-position) to reverse the order |
