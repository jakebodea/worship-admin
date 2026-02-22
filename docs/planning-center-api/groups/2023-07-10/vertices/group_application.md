# GroupApplication

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `group_application`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/group_application`
- Resource path: `https://api.planningcenteronline.com/groups/v2/group_applications`
- Collection only: `no`
- Deprecated: `no`


## Description

A group application is a request to join a group which can be approved or rejected.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| approve | https://api.planningcenteronline.com/groups/v2/group_applications/{group_application_id}/approve | - | The group application you've approved. | no |
| reject | https://api.planningcenteronline.com/groups/v2/group_applications/{group_application_id}/reject | - | The group application you've rejected. | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| applied_at | date_time (e.g. 2000-01-01T12:00:00Z) | Timestamp when this person applied. | public |
| id | primary_key (e.g. primary_key) | - | public |
| message | string (e.g. string) | An optional personal message from the applicant. | public |
| status | string (e.g. string) | The approval status of the application.  Possible values: `pending`, `approved`, or `rejected` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| group | group | - |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| group-groupapplication-group | group | group being applied to |
| person-groupapplication-person | person | person who applied |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| groupapplication-group-applications | applications | requests to join this group |
| groupapplication-organization-group_applications | group_applications | requests to join groups for this organization |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | group | include associated group |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | applied_at | prefix with a hyphen (-applied_at) to reverse the order |
|  | status | prefix with a hyphen (-status) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | applied_at | Query on a specific applied_at |
|  | status | Query on a specific status |


## Examples

### Example 1: approve
- Path: `https://api.planningcenteronline.com/groups/v2/group_applications/{group_application_id}/approve`
```json
{
  "data": {
    "attributes": {
      "role": "member"
    },
    "type": "GroupApplicationApproveAction"
  }
}
```
