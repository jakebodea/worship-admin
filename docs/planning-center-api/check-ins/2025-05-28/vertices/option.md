# Option

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `option`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/option`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/options`
- Collection only: `no`
- Deprecated: `no`


## Description

An option which an attendee may select when checking in.

Options may have extra labels associated with them, denoted by `label` and `quantity`.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| body | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| quantity | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| checkin-option-check_ins | check_ins | - |
| label-option-label | label | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| option-checkin-options | options | - |
| option-location-options | options | - |
| option-organization-options | options | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | label | include associated label |
