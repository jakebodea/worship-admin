# App

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `app`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/app`
- Resource path: `https://api.planningcenteronline.com/people/v2/apps`
- Collection only: `no`
- Deprecated: `no`


## Description

An app is one of the handful of apps that Planning Center offers that organizations can subscribe to, e.g. Services, Registrations, etc.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| url | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| app-messagegroup-app | app | - |
| app-organization-apps | apps | - |
| app-personapp-app | app | - |
| app-person-apps | apps | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | url | prefix with a hyphen (-url) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | Query on a specific name |
|  | url | Query on a specific url |
