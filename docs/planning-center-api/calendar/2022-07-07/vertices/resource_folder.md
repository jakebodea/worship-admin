# ResourceFolder

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `resource_folder`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/resource_folder`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/resource_folders`
- Collection only: `no`
- Deprecated: `no`


## Description

An organizational folder containing rooms or resources.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| ancestry | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the folder was created | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the folder | public |
| kind | string (e.g. string) | The type of folder, can either be `Room` or `Resource` | public |
| name | string (e.g. string) | The folder name | public |
| path_name | string (e.g. string) | A string representing the location of the folder if it is nested.  Each parent folder is separated by `/` | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the folder was updated | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resource-resourcefolder-resources | resources | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resourcefolder-organization-resource_folders | resource_folders | - |
| resourcefolder-resource-resource_folder | resource_folder | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | resources | include associated resources |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ancestry | prefix with a hyphen (-ancestry) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ancestry | Query on a specific ancestry |
|  | created_at | Query on a specific created_at |
|  | name | Query on a specific name |
|  | path_name | Query on a specific path_name |
|  | updated_at | Query on a specific updated_at |
