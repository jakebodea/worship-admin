# SignupLocation

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `signup_location`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/signup_location`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/signups/{signup_id}/signup_location`
- Collection only: `no`
- Deprecated: `no`


## Description

`Signup_location` is the location of a signup.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | The name of the signup location. | public |
| address_data | json (e.g. json) | The address data of the signup location, which includes details like street, city, state, and postal code.   Only available when requested with the `?fields` param | public |
| subpremise | string (e.g. string) | The subpremise of the signup location, such as an building or room number. | public |
| latitude | string (e.g. string) | The latitude of the signup location. | public |
| longitude | string (e.g. string) | The longitude of the signup location. | public |
| location_type | string (e.g. string) | The type of location, such as `address`, `coords`, or `online`. | public |
| url | string (e.g. string) | The URL for the signup location, if applicable (e.g., for online events). | public |
| formatted_address | string (e.g. string) | The formatted address of the signup location, which may not include subpremise details. | public |
| full_formatted_address | string (e.g. string) | The fully formatted address of the signup location, including subpremise details. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| signuplocation-signup-signup_location | signup_location | - |
