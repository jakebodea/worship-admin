# SpamEmailAddress

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `spam_email_address`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/spam_email_address`
- Resource path: `https://api.planningcenteronline.com/people/v2/spam_email_addresses`
- Collection only: `no`
- Deprecated: `no`


## Description

An email address that is marked as spam


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| address | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| spamemailaddress-organization-spam_email_addresses | spam_email_addresses | - |
