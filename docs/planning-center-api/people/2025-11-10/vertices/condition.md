# Condition

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `condition`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/condition`
- Resource path: `https://api.planningcenteronline.com/people/v2/lists/{list_id}/rules/{rule_id}/conditions`
- Collection only: `no`
- Deprecated: `no`


## Description

A condition is an individual criterion used by a List Rule.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| application | string (e.g. string) | - | public |
| comparison | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| definition_class | string (e.g. string) | - | public |
| definition_identifier | string (e.g. string) | - | public |
| description | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| settings | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| created_by | created_by | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-condition-created_by | created_by | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| condition-rule-conditions | conditions | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_by | include associated created_by |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | application | prefix with a hyphen (-application) to reverse the order |
|  | comparison | prefix with a hyphen (-comparison) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | definition_class | prefix with a hyphen (-definition_class) to reverse the order |
|  | definition_identifier | prefix with a hyphen (-definition_identifier) to reverse the order |
|  | description | prefix with a hyphen (-description) to reverse the order |
|  | settings | prefix with a hyphen (-settings) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | application | Query on a specific application |
|  | comparison | Query on a specific comparison |
|  | created_at | Query on a specific created_at |
|  | definition_class | Query on a specific definition_class |
|  | definition_identifier | Query on a specific definition_identifier |
|  | description | Query on a specific description |
|  | settings | Query on a specific settings |
|  | updated_at | Query on a specific updated_at |
