# PeopleImportConflict

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `people_import_conflict`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/people_import_conflict`
- Resource path: `https://api.planningcenteronline.com/people/v2/people_imports/{people_import_id}/conflicts`
- Collection only: `no`
- Deprecated: `no`


## Description

A PeopleImportConflict is a record of change that will occur if the parent PeopleImport is completed.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| conflicting_changes | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| data | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| ignore | boolean (e.g. True) | - | public |
| kind | string (e.g. string) | - | public |
| message | string (e.g. string) | - | public |
| name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| peopleimportconflict-peopleimport-conflicts | conflicts | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | kind | Query on a specific kind |
|  | name | Query on a specific name |
