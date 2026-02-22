# FormSubmission

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `form_submission`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/form_submission`
- Resource path: `https://api.planningcenteronline.com/people/v2/forms/{form_id}/form_submissions`
- Collection only: `no`
- Deprecated: `no`


## Description

A form submission.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| requires_verification | boolean (e.g. True) | Only available when requested with the `?fields` param | public |
| verified | boolean (e.g. True) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| form | form | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| form-formsubmission-form | form | - |
| formfield-formsubmission-form_fields | form_fields | - |
| formsubmissionvalue-formsubmission-form_submission_values | form_submission_values | - |
| person-formsubmission-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| formsubmission-form-form_submissions | form_submissions | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | form | include associated form |
|  | form_fields | include associated form_fields |
|  | form_submission_values | include associated form_submission_values |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | person.first_name | prefix with a hyphen (-person.first_name) to reverse the order |
|  | person.last_name | prefix with a hyphen (-person.last_name) to reverse the order |
