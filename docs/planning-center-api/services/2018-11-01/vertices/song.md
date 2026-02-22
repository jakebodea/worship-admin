# Song

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `song`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/song`
- Resource path: `https://api.planningcenteronline.com/services/v2/songs`
- Collection only: `no`
- Deprecated: `no`


## Description

A song


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| assign_tags | https://api.planningcenteronline.com/services/v2/songs/{song_id}/assign_tags | Used to assign tags to a song. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| admin | string (e.g. string) | - | public |
| author | string (e.g. string) | - | public |
| ccli_number | integer (e.g. 1) | - | public |
| copyright | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| hidden | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_scheduled_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| last_scheduled_short_dates | string (e.g. string) | - | public |
| notes | string (e.g. string) | - | public |
| themes | string (e.g. string) | - | public |
| title | string (e.g. string) | The name of the song.  When setting this value on a create you can pass a CCLI number and Services will fetch the song metadata for you. | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| arrangement-song-arrangements | arrangements | - |
| attachment-song-attachments | attachments | - |
| item-song-last_scheduled_item | last_scheduled_item | The Song's most recently scheduled Item in a given Service Type. Requires a `service_type` query parameter. e.g. `?service_type=789` |
| songschedule-song-song_schedules | song_schedules | - |
| tag-song-tags | tags | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| song-item-song | song | - |
| song-organization-songs | songs | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | last_scheduled_at | prefix with a hyphen (-last_scheduled_at) to reverse the order |
|  | title | prefix with a hyphen (-title) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | author | Query on a specific author |
|  | ccli_number | Query on a specific ccli_number |
|  | hidden | Query on a specific hidden |
|  | themes | Query on a specific themes |
|  | title | Query on a specific title |
