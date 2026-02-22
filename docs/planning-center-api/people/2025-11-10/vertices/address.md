# Address

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `address`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/address`
- Resource path: `https://api.planningcenteronline.com/people/v2/addresses`
- Collection only: `no`
- Deprecated: `no`


## Description

An address represents a physical and/or mailing address for a person.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| city | string (e.g. string) | - | public |
| country_code | string (e.g. string) | - | public |
| country_name | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| location | string (e.g. string) | - | public |
| primary | boolean (e.g. True) | - | public |
| state | string (e.g. string) | - | public |
| street_line_1 | string (e.g. string) | - | public |
| street_line_2 | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| zip | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| address-organization-addresses | addresses | - |
| address-person-addresses | addresses | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | city | prefix with a hyphen (-city) to reverse the order |
|  | country_code | prefix with a hyphen (-country_code) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | location | prefix with a hyphen (-location) to reverse the order |
|  | primary | prefix with a hyphen (-primary) to reverse the order |
|  | state | prefix with a hyphen (-state) to reverse the order |
|  | street_line_1 | prefix with a hyphen (-street_line_1) to reverse the order |
|  | street_line_2 | prefix with a hyphen (-street_line_2) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
|  | zip | prefix with a hyphen (-zip) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | city | Query on a specific city |
|  | country_code | Query on a specific country_code |
|  | location | Query on a specific location |
|  | primary | Query on a specific primary |
|  | state | Query on a specific state |
|  | street_line_1 | Query on a specific street_line_1 |
|  | street_line_2 | Query on a specific street_line_2 |
|  | zip | Query on a specific zip |
