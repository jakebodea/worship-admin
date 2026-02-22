# ConnectedPerson

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `connected_person`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/connected_person`
- Resource path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/connected_people`
- Collection only: `no`
- Deprecated: `no`


## Description

A Connected Person is an account from a different organization linked to an account in this organization.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| first_name | string (e.g. string) | - | public |
| gender | string (e.g. string) | - | public |
| given_name | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_name | string (e.g. string) | - | public |
| middle_name | string (e.g. string) | - | public |
| nickname | string (e.g. string) | - | public |
| organization_id | primary_key (e.g. primary_key) | - | public |
| organization_name | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| organization | organization | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| connectedperson-person-connected_people | connected_people | - |
