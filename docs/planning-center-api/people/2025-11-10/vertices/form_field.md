# FormField

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `form_field`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/form_field`
- Resource path: `https://api.planningcenteronline.com/people/v2/forms/{form_id}/fields`
- Collection only: `no`
- Deprecated: `no`


## Description

A field in a custom form.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| description | string (e.g. string) | - | public |
| field_type | string (e.g. value) | Possible values: `string`, `text`, `checkboxes`, `dropdown`, `date`, `phone_number`, `address`, `birthday`, `gender`, `custom_field`, `note`, `workflow`, `heading`, `number`, `boolean`, `file`, `medical`, `workflow_checkbox`, `workflow_checkboxes`, `workflow_dropdown`, `marital_status`, `anniversary`, `grade`, `primary_campus`, `school`, or `household` | public |
| id | primary_key (e.g. primary_key) | - | public |
| label | string (e.g. string) | - | public |
| required | boolean (e.g. True) | - | public |
| sequence | integer (e.g. 1) | - | public |
| settings | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| form | form | - |
| fieldable | fieldable | - |
| options | options | - |
| form_field_conditions | form_field_conditions | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| formfieldoption-formfield-options | options | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| formfield-form-fields | fields | - |
| formfield-formsubmission-form_fields | form_fields | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | options | include associated options |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
