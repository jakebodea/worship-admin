# PeopleImport

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `people_import`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/people_import`
- Resource path: `https://api.planningcenteronline.com/people/v2/people_imports`
- Collection only: `no`
- Deprecated: `no`


## Description

A PeopleImport is a record of an ongoing or previous import from a CSV file.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| attribs | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| processed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| status | string (e.g. value) | Possible values: `matching`, `processing_preview`, `previewing`, `processing_import`, `complete`, `undone`, or `undoing` | public |
| undone_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| created_by | created_by | - |
| undone_by | undone_by | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| peopleimportconflict-peopleimport-conflicts | conflicts | - |
| peopleimporthistory-peopleimport-histories | histories | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| peopleimport-organization-people_imports | people_imports | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | status | Query on a specific status  Possible values: `matching`, `processing_preview`, `previewing`, `processing_import`, `complete`, `undone`, or `undoing` |
