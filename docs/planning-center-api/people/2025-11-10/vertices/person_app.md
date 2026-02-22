# PersonApp

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `person_app`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/person_app`
- Resource path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/person_apps`
- Collection only: `no`
- Deprecated: `no`


## Description

A Person App is the relationship between a Person and an App.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| allow_pco_login | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| people_permissions | string (e.g. value) | Possible values: `no_access`, `viewer`, or `editor` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| app | app | - |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| app-personapp-app | app | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| personapp-person-person_apps | person_apps | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | app | include associated app |
