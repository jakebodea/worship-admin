# Signup

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `signup`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/signup`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/signups`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Signup` is an organization signup that people can register for.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| archived | boolean (e.g. True) | Whether the signup is archived or not. | public |
| close_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which regsitration closes. | public |
| description | string (e.g. string) | Decription of the signup. | public |
| logo_url | string (e.g. string) | URL for the image used for the signup. | public |
| name | string (e.g. string) | Name of the signup. | public |
| new_registration_url | string (e.g. string) | URL to allow people to register for signup. | public |
| open_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which regsitration opens. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attendee-signup-attendees | attendees | - |
| campus-signup-campuses | campuses | - |
| category-signup-categories | categories | - |
| signuptime-signup-next_signup_time | next_signup_time | - |
| registration-signup-registrations | registrations | - |
| selectiontype-signup-selection_types | selection_types | - |
| signuplocation-signup-signup_location | signup_location | - |
| signuptime-signup-signup_times | signup_times | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| signup-organization-signups | signups | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | campuses | include associated campuses |
|  | categories | include associated categories |
|  | next_signup_time | include associated next_signup_time |
|  | signup_location | include associated signup_location |
|  | signup_times | include associated signup_times |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | Query on a specific id |
