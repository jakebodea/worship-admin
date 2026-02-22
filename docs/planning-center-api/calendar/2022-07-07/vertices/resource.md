# Resource

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `resource`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/resource`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/resources`
- Collection only: `no`
- Deprecated: `no`


## Description

A room or resource that can be requested for use as part of
an event.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the room or resource was created | public |
| description | string (e.g. string) | Description of the room or resource | public |
| expires_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the resource expires | public |
| home_location | string (e.g. string) | Where the resource is normally kept | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the room or resource | public |
| image | string (e.g. string) | Path to where resource image is stored | public |
| kind | string (e.g. string) | The type of resource, can either be `Room` or `Resource` | public |
| name | string (e.g. string) | The name of the room or resource | public |
| path_name | string (e.g. string) | A string representing the location of the resource if it is nested within a folder.  Each parent folder is separated by `/` | public |
| quantity | integer (e.g. 1) | The quantity of the resource | public |
| serial_number | string (e.g. string) | The serial number of the resource | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the room or resource was updated | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| conflict-resource-conflicts | conflicts | - |
| eventresourcerequest-resource-event_resource_requests | event_resource_requests | - |
| requiredapproval-resource-required_approvals | required_approvals | - |
| resourceapprovalgroup-resource-resource_approval_groups | resource_approval_groups | - |
| resourcebooking-resource-resource_bookings | resource_bookings | - |
| resourcefolder-resource-resource_folder | resource_folder | - |
| resourcequestion-resource-resource_questions | resource_questions | - |
| roomsetup-resource-room_setups | room_setups | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resource-conflict-resource | resource | - |
| resource-eventresourcerequest-resource | resource | - |
| resource-organization-resources | resources | - |
| resource-requiredapproval-resource | resource | - |
| resource-resourceapprovalgroup-resources | resources | - |
| resource-resourcebooking-resource | resource | - |
| resource-resourcefolder-resources | resources | - |
| resource-resourcesuggestion-resource | resource | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | resource_approval_groups | include associated resource_approval_groups |
|  | resource_folder | include associated resource_folder |
|  | resource_questions | include associated resource_questions |
|  | room_setups | include associated room_setups |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | expires_at | prefix with a hyphen (-expires_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | kind | Query on a specific kind |
|  | name | Query on a specific name |
|  | path_name | Query on a specific path_name |
|  | serial_number | Query on a specific serial_number |
|  | updated_at | Query on a specific updated_at |
