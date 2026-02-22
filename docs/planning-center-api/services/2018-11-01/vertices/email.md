# Email

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `email`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/email`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/emails`
- Collection only: `no`
- Deprecated: `no`


## Description

A persons email


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| address | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| primary | boolean (e.g. True) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| email-person-emails | emails | - |
