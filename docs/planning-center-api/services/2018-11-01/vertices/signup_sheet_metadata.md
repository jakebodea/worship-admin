# SignupSheetMetadata

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `signup_sheet_metadata`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/signup_sheet_metadata`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/available_signups/{available_signup_id}/signup_sheets/{signup_sheet_id}/signup_sheet_metadata`
- Collection only: `yes`
- Deprecated: `no`


## Description

A SignupSheetMetadata Resource


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| conflicts | hash (e.g. {}) | - | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| time_name | string (e.g. string) | - | public |
| time_type | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| plan_time | plan_time | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| signupsheetmetadata-signupsheet-signup_sheet_metadata | signup_sheet_metadata | - |
