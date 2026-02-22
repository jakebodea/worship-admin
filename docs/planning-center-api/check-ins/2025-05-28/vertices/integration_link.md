# IntegrationLink

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `integration_link`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/integration_link`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/integration_links`
- Collection only: `no`
- Deprecated: `no`


## Description

A record linking another product's resource to a Check-Ins resource.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| remote_app | string (e.g. string) | - | public |
| remote_gid | string (e.g. string) | The Global ID for the external resource. Formatted as `gid://<app>/<type>/<id>`. | public |
| remote_id | string (e.g. string) | - | public |
| remote_type | string (e.g. string) | - | public |
| sync_future_assignment_types | boolean (e.g. True) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| local | local | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| integrationlink-event-integration_links | integration_links | - |
| integrationlink-location-integration_links | integration_links | - |
| integrationlink-organization-integration_links | integration_links | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | remote_gid | Query on a specific remote_gid |
