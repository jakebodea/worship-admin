# Email

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `email`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/email`
- Resource path: `https://api.planningcenteronline.com/people/v2/emails`
- Collection only: `no`
- Deprecated: `no`


## Description

An email represents an email address and location.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| address | string (e.g. string) | - | public |
| blocked | boolean (e.g. True) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| location | string (e.g. string) | - | public |
| primary | boolean (e.g. True) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-email-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| email-organization-emails | emails | - |
| email-person-emails | emails | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | address | prefix with a hyphen (-address) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | location | prefix with a hyphen (-location) to reverse the order |
|  | primary | prefix with a hyphen (-primary) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | address | Query on a specific address |
|  | blocked | Query on a specific blocked |
|  | created_at | Query on a specific created_at |
|  | location | Query on a specific location |
|  | primary | Query on a specific primary |
|  | updated_at | Query on a specific updated_at |
