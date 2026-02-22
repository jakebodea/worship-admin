# AvailableEvent

- App: `webhooks`
- Version: `2022-10-20`
- Vertex ID: `available_event`
- Endpoint: `https://api.planningcenteronline.com/webhooks/v2/documentation/2022-10-20/vertices/available_event`
- Resource path: `https://api.planningcenteronline.com/webhooks/v2/available_events`
- Collection only: `yes`
- Deprecated: `no`


## Description

An event supported by webhooks


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| action | string (e.g. string) | - | public |
| app | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| resource | string (e.g. string) | - | public |
| type | string (e.g. string) | - | public |
| version | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| availableevent-organization-available_events | available_events | - |
