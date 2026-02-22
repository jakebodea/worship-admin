# PersonMerger

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `person_merger`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/person_merger`
- Resource path: `https://api.planningcenteronline.com/people/v2/person_mergers`
- Collection only: `no`
- Deprecated: `no`


## Description

A Person Merger is the history of profiles that were merged into other profiles.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| person_to_keep_id | primary_key (e.g. primary_key) | - | public |
| person_to_remove_id | primary_key (e.g. primary_key) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person_to_keep | person_to_keep | - |
| person_to_remove | person_to_remove | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| personmerger-organization-person_mergers | person_mergers | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | person_to_keep_id | Query on a specific person_to_keep_id |
|  | person_to_remove_id | Query on a specific person_to_remove_id |
