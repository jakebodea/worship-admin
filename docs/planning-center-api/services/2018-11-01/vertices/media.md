# Media

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `media`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/media`
- Resource path: `https://api.planningcenteronline.com/services/v2/media`
- Collection only: `no`
- Deprecated: `no`


## Description

A piece of media


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| archive | https://api.planningcenteronline.com/services/v2/media/{media_id}/archive | Archive a Media. | - | no |
| assign_tags | https://api.planningcenteronline.com/services/v2/media/{media_id}/assign_tags | Used to assign tags to a media. | - | no |
| unarchive | https://api.planningcenteronline.com/services/v2/media/{media_id}/unarchive | Restore an archived Media. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| creator_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| image_url | string (e.g. string) | - | public |
| length | integer (e.g. 1) | - | public |
| media_type | string (e.g. string) | Possible Values:  - `audio`  - `background_audio`  - `background_image`  - `background_video`  - `countdown`  - `curriculum`  - `document`  - `drama`  - `image`  - `powerpoint`  - `song_video`  - `video` | public |
| media_type_name | string (e.g. string) | - | public |
| preview_content_type | string (e.g. string) | - | public |
| preview_file_name | string (e.g. string) | - | public |
| preview_file_size | integer (e.g. 1) | - | public |
| preview_updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| preview_url | string (e.g. string) | - | public |
| themes | string (e.g. string) | - | public |
| thumbnail_content_type | string (e.g. string) | - | public |
| thumbnail_file_name | string (e.g. string) | - | public |
| thumbnail_file_size | integer (e.g. 1) | - | public |
| thumbnail_updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| thumbnail_url | string (e.g. string) | - | public |
| title | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-media-attachments | attachments | - |
| mediaschedule-media-media_schedules | media_schedules | - |
| tag-media-tags | tags | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| media-item-media | media | - |
| media-organization-media | media | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | attachments | include associated attachments |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | title | prefix with a hyphen (-title) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | creator_name | Query on a specific creator_name |
|  | id | Query on a specific id |
|  | themes | Query on a specific themes |
|  | title | Query on a specific title |
