# PhoneNumber

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `phone_number`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/phone_number`
- Resource path: `https://api.planningcenteronline.com/people/v2/phone_numbers`
- Collection only: `no`
- Deprecated: `no`


## Description

A phone number represents a single telephone number and location.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| carrier | string (e.g. string) | - | public |
| country_code | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| e164 | string (e.g. string) | - | public |
| formatted_number | string (e.g. string) | Only available when requested with the `?fields` param | public |
| id | primary_key (e.g. primary_key) | - | public |
| international | string (e.g. string) | - | public |
| location | string (e.g. string) | - | public |
| national | string (e.g. string) | - | public |
| number | string (e.g. string) | - | public |
| primary | boolean (e.g. True) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| phonenumber-organization-phone_numbers | phone_numbers | - |
| phonenumber-person-phone_numbers | phone_numbers | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | carrier | prefix with a hyphen (-carrier) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | location | prefix with a hyphen (-location) to reverse the order |
|  | number | prefix with a hyphen (-number) to reverse the order |
|  | primary | prefix with a hyphen (-primary) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | carrier | Query on a specific carrier |
|  | created_at | Query on a specific created_at |
|  | location | Query on a specific location |
|  | number | Query on a specific number |
|  | primary | Query on a specific primary |
|  | updated_at | Query on a specific updated_at |
