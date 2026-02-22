# BackgroundCheck

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `background_check`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/background_check`
- Resource path: `https://api.planningcenteronline.com/people/v2/background_checks`
- Collection only: `no`
- Deprecated: `no`


## Description

Background Checks for a Person


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| completed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| current | boolean (e.g. True) | - | public |
| expires_on | date (e.g. 2000-01-01) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| note | string (e.g. string) | - | public |
| report_url | string (e.g. string) | - | public |
| status | string (e.g. string) | - | public |
| status_updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| created_by | created_by | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-backgroundcheck-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| backgroundcheck-organization-background_checks | background_checks | - |
| backgroundcheck-person-background_checks | background_checks | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |
