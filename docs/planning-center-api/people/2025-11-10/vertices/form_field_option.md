# FormFieldOption

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `form_field_option`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/form_field_option`
- Resource path: `https://api.planningcenteronline.com/people/v2/forms/{form_id}/fields/{field_id}/options`
- Collection only: `no`
- Deprecated: `no`


## Description

A field option on a custom form field.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| label | string (e.g. string) | - | public |
| sequence | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| form_field | form_field | - |
| optionable | optionable | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| formfieldoption-formfield-options | options | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
