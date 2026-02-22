# AttachmentType

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `attachment_type`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/attachment_type`
- Resource path: `https://api.planningcenteronline.com/services/v2/attachment_types`
- Collection only: `no`
- Deprecated: `no`


## Description

Create an Attachment Type for each type of file you might want only specific people to see. When you attach a file, you can specify an attachment type to then be able to link the file to a position.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| aliases | string (e.g. string) | - | editor |
| built_in | boolean (e.g. True) | - | public |
| capoed_chord_charts | boolean (e.g. True) | - | editor |
| chord_charts | boolean (e.g. True) | - | editor |
| exclusions | string (e.g. string) | - | editor |
| id | primary_key (e.g. primary_key) | - | public |
| lyrics | boolean (e.g. True) | - | editor |
| name | string (e.g. string) | - | public |
| number_charts | boolean (e.g. True) | - | editor |
| numeral_charts | boolean (e.g. True) | - | editor |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment_type_group | attachment_type_group | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachmenttype-organization-attachment_types | attachment_types | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
