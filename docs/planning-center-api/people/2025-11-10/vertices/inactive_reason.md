# InactiveReason

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `inactive_reason`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/inactive_reason`
- Resource path: `https://api.planningcenteronline.com/people/v2/inactive_reasons`
- Collection only: `no`
- Deprecated: `no`


## Description

An inactive reason is a small bit of text indicating why a member is no longer active.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| value | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| inactivereason-organization-inactive_reasons | inactive_reasons | - |
| inactivereason-person-inactive_reason | inactive_reason | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | value | prefix with a hyphen (-value) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | value | Query on a specific value |
