# ChannelNextTime

- App: `publishing`
- Version: `2024-03-25`
- Vertex ID: `channel_next_time`
- Endpoint: `https://api.planningcenteronline.com/publishing/v2/documentation/2024-03-25/vertices/channel_next_time`
- Resource path: `https://api.planningcenteronline.com/publishing/v2/channels/{channel_id}/next_times`
- Collection only: `no`
- Deprecated: `no`


## Description

The next default time for a channel


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| channelnexttime-channel-next_times | next_times | - |
