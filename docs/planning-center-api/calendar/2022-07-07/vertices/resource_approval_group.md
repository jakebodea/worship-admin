# ResourceApprovalGroup

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `resource_approval_group`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/resource_approval_group`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/resource_approval_groups`
- Collection only: `no`
- Deprecated: `no`


## Description

A group of people that can be attached to a room or resource
in order to require their approval for booking.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the approval group was created | public |
| form_count | integer (e.g. 1) | Only available when requested with the `?fields` param | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the approval group | public |
| name | string (e.g. string) | Name of the approval group | public |
| resource_count | integer (e.g. 1) | The number of resources in the approval group  Only available when requested with the `?fields` param | public |
| room_count | integer (e.g. 1) | The number of rooms in the approval group  Only available when requested with the `?fields` param | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the approval group was updated | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventresourcerequest-resourceapprovalgroup-event_resource_requests | event_resource_requests | - |
| person-resourceapprovalgroup-people | people | - |
| requiredapproval-resourceapprovalgroup-required_approvals | required_approvals | - |
| resource-resourceapprovalgroup-resources | resources | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resourceapprovalgroup-organization-resource_approval_groups | resource_approval_groups | - |
| resourceapprovalgroup-resource-resource_approval_groups | resource_approval_groups | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | people | include associated people |
|  | resources | include associated resources |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
