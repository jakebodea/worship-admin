# FormSubmissionValue

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `form_submission_value`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/form_submission_value`
- Resource path: `https://api.planningcenteronline.com/people/v2/forms/{form_id}/form_submissions/{form_submission_id}/form_submission_values`
- Collection only: `no`
- Deprecated: `no`


## Description

A form submission value.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| attachments | array (e.g. []) | - | public |
| display_value | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| form_field | form_field | - |
| form_field_option | form_field_option | - |
| form_submission | form_submission | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| formsubmissionvalue-formsubmission-form_submission_values | form_submission_values | - |
