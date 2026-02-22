# CustomSender

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `custom_sender`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/custom_sender`
- Resource path: `https://api.planningcenteronline.com/people/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

A custom sender that can be used when sending emails.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| send_verification | https://api.planningcenteronline.com/people/v2 | Begins the verification process when a custom sender's email address is created or updated. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| email_address | string (e.g. string) | - | public |
| expired | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| verification_requested_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| verification_status | string (e.g. string) | - | public |
| verified | boolean (e.g. True) | - | public |
| verified_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| custom_sender_shares | custom_sender_shares | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |
|  | verification_requested_at | prefix with a hyphen (-verification_requested_at) to reverse the order |
|  | verified_at | prefix with a hyphen (-verified_at) to reverse the order |
