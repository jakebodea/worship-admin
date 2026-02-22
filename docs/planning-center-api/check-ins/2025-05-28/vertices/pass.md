# Pass

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `pass`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/pass`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/passes`
- Collection only: `no`
- Deprecated: `no`


## Description

Enables quick lookup of a person via barcode reader.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| code | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. string) | Possible values: `barcode` or `pkpass`.  Using the `pkpass` value creates a mobile pass and sends an email to the associated person. | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-pass-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| pass-organization-passes | passes | - |
| pass-person-passes | passes | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | code | Query on a specific code |
