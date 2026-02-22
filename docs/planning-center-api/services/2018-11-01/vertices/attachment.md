# Attachment

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `attachment`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/attachment`
- Resource path: `https://api.planningcenteronline.com/services/v2/media/{media_id}/attachments`
- Collection only: `no`
- Deprecated: `no`


## Description

A file, whether it's stored on Planning Center or linked from another location.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| open | https://api.planningcenteronline.com/services/v2/media/{media_id}/attachments/{attachment_id}/open | This action is used to get the attachment file URL.  It is accessed by `POST`ing to `.../attachments/1/open`  This will generate the URL and return it in the `attachment_url` attribute of the `AttachmentActivity`. | - | no |
| preview | https://api.planningcenteronline.com/services/v2/media/{media_id}/attachments/{attachment_id}/preview | This action is used to get a reduced resolution (preview) version of the attachment.  It is accessed by `POST`ing to `.../attachments/1/preview`  This will generate the URL and return it in the `attachment_url` attribute of the `AttachmentActivity`.  The `has_preview` attribute of an `Attachment` indicates if a preview is available. When a preview is not available this action will return a `Not Found` error with a status code of `404`. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| allow_mp3_download | boolean (e.g. True) | - | public |
| content | string (e.g. string) | - | public |
| content_type | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| deleted_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | soft_deletable |
| display_name | string (e.g. string) | - | public |
| downloadable | boolean (e.g. True) | - | public |
| file_size | integer (e.g. 1) | - | public |
| file_upload_identifier | string (e.g. string) | Planning Center File UUID. Required only when creating a file attachment. See the "File Uploads" section of the API documentation for more information.  Only available when requested with the `?fields` param | public |
| filename | string (e.g. string) | - | public |
| filetype | string (e.g. string) | - | public |
| has_preview | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| import_to_item_details | boolean (e.g. True) | - | public |
| licenses_purchased | integer (e.g. 1) | - | public |
| licenses_remaining | integer (e.g. 1) | - | public |
| licenses_used | integer (e.g. 1) | - | public |
| linked_url | string (e.g. string) | - | public |
| page_order | string (e.g. string) | - | public |
| pco_type | string (e.g. string) | - | public |
| remote_link | string (e.g. string) | - | public |
| streamable | boolean (e.g. True) | - | public |
| thumbnail_url | string (e.g. string) | - | public |
| transposable | boolean (e.g. True) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| url | string (e.g. string) | - | public |
| web_streamable | boolean (e.g. True) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| attachable | attachable | - |
| attachment_types | attachment_types | - |
| created_by | created_by | - |
| updated_by | updated_by | - |
| administrator | administrator | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| zoom-attachment-zooms | zooms | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-arrangement-attachments | attachments | - |
| attachment-item-attachments | attachments | - |
| attachment-item-selected_attachment | selected_attachment | - |
| attachment-item-selected_background | selected_background | - |
| attachment-key-attachments | attachments | - |
| attachment-media-attachments | attachments | - |
| attachment-plan-all_attachments | all_attachments | - |
| attachment-plan-attachments | attachments | - |
| attachment-servicetype-attachments | attachments | - |
| attachment-song-attachments | attachments | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | zooms | include associated zooms |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | attachable_type | prefix with a hyphen (-attachable_type) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | deleted_at | prefix with a hyphen (-deleted_at) to reverse the order |
|  | filename | prefix with a hyphen (-filename) to reverse the order |
|  | filetype | prefix with a hyphen (-filetype) to reverse the order |
|  | size | prefix with a hyphen (-size) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | administrator_id | Query on a related administrator |
|  | licenses_purchased | Query on a specific licenses_purchased |
