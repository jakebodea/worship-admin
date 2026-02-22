# BlockoutException

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `blockout_exception`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/blockout_exception`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/blockouts/{blockout_id}/blockout_exceptions`
- Collection only: `no`
- Deprecated: `no`


## Description

A single exception for the dates generated from the blockout


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| date | date (e.g. 2000-01-01) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| blockout | blockout | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| blockoutexception-blockout-blockout_exceptions | blockout_exceptions | - |
