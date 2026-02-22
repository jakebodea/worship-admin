# Attachment

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `attachment`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/attachment`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/attachments`
- Collection only: `no`
- Deprecated: `no`


## Description

An uploaded file attached to an event.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| content_type | string (e.g. string) | MIME type of the attachment | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the attachment was created | public |
| description | string (e.g. string) | Description of the attachment | public |
| file_size | integer (e.g. 1) | File size in bytes | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the attachment | public |
| name | string (e.g. string) | Set to the file name if not provided | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the attachment was updated | public |
| url | string (e.g. string) | Path to where the attachment is stored | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-attachment-event | event | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-event-attachments | attachments | - |
| attachment-organization-attachments | attachments | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | event | include associated event |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | content_type | prefix with a hyphen (-content_type) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | description | prefix with a hyphen (-description) to reverse the order |
|  | file_size | prefix with a hyphen (-file_size) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | content_type | Query on a specific content_type |
|  | created_at | Query on a specific created_at |
|  | description | Query on a specific description |
|  | file_size | Query on a specific file_size |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
