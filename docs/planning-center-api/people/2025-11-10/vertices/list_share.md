# ListShare

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `list_share`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/list_share`
- Resource path: `https://api.planningcenteronline.com/people/v2/lists/{list_id}/shares`
- Collection only: `no`
- Deprecated: `no`


## Description

A list share indicates who has access to edit a list.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| group | string (e.g. value) | Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| permission | string (e.g. value) | Possible values: `view` or `manage` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-listshare-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| listshare-list-shares | shares | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | group | prefix with a hyphen (-group) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | group | Query on a specific group  Possible values: `No Access`, `Viewer`, `Editor`, or `Manager` |
|  | name | Query on a specific name |
|  | permission | Query on a specific permission  Possible values: `view` or `manage` |
