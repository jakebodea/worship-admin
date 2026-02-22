# PeopleImportHistory

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `people_import_history`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/people_import_history`
- Resource path: `https://api.planningcenteronline.com/people/v2/people_imports/{people_import_id}/histories`
- Collection only: `no`
- Deprecated: `no`


## Description

A PeopleImportHistory is a record of change that occurred when the parent PeopleImport was completed.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| conflicting_changes | hash (e.g. {}) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| kind | string (e.g. string) | - | public |
| name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| household-peopleimporthistory-household | household | - |
| person-peopleimporthistory-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| peopleimporthistory-peopleimport-histories | histories | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | household | include associated household |
|  | person | include associated person |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | Query on a specific name |
