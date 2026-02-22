# AvailableSignup

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `available_signup`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/available_signup`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/available_signups`
- Collection only: `no`
- Deprecated: `no`


## Description

Signups that are available.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| organization_name | string (e.g. string) | - | public |
| planning_center_url | string (e.g. string) | - | public |
| service_type_name | string (e.g. string) | - | public |
| signups_available | boolean (e.g. True) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| organization | organization | - |
| person | person | - |
| service_type | service_type | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| signupsheet-availablesignup-signup_sheets | signup_sheets | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| availablesignup-person-available_signups | available_signups | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | signup_sheets | include associated signup_sheets |
