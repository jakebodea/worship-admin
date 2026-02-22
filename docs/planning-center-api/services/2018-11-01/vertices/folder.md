# Folder

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `folder`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/folder`
- Resource path: `https://api.planningcenteronline.com/services/v2/folders`
- Collection only: `no`
- Deprecated: `no`


## Description

A folder is a container used to organize multiple Service Types or other Folders.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| container | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| ancestors | ancestors | - |
| parent | parent | - |
| campus | campus | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| folder-folder-folders | folders | - |
| servicetype-folder-service_types | service_types | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| folder-folder-folders | folders | - |
| folder-organization-folders | folders | - |
| folder-taggroup-folder | folder | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | service_types | include associated service_types |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | parent_id | Query on a related parent |
