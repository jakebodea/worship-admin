# MaritalStatus

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `marital_status`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/marital_status`
- Resource path: `https://api.planningcenteronline.com/people/v2/marital_statuses`
- Collection only: `no`
- Deprecated: `no`


## Description

A martial status represents a member's current status, e.g. married, single, etc.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| value | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| maritalstatus-organization-marital_statuses | marital_statuses | - |
| maritalstatus-person-marital_status | marital_status | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |
|  | value | prefix with a hyphen (-value) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | value | Query on a specific value |
