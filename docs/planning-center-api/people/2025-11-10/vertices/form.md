# Form

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `form`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/form`
- Resource path: `https://api.planningcenteronline.com/people/v2/forms`
- Collection only: `no`
- Deprecated: `no`


## Description

A custom form for people to fill out.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| active | boolean (e.g. True) | - | public |
| archived | boolean (e.g. True) | - | public |
| archived_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| deleted_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| description | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| login_required | boolean (e.g. True) | - | public |
| name | string (e.g. string) | - | public |
| public_url | string (e.g. string) | - | public |
| recently_viewed | boolean (e.g. True) | - | public |
| send_submission_notification_to_submitter | boolean (e.g. True) | - | public |
| submission_count | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| campus | campus | - |
| form_category | form_category | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-form-campus | campus | - |
| formcategory-form-category | category | - |
| formfield-form-fields | fields | - |
| formsubmission-form-form_submissions | form_submissions | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| form-formsubmission-form | form | - |
| form-organization-forms | forms | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | campus | include associated campus |
|  | category | include associated category |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | active | prefix with a hyphen (-active) to reverse the order |
|  | archived_at | prefix with a hyphen (-archived_at) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | deleted_at | prefix with a hyphen (-deleted_at) to reverse the order |
|  | description | prefix with a hyphen (-description) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | active | Query on a specific active |
|  | id | Query on a specific id |
