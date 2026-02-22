# RequiredApproval

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `required_approval`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/required_approval`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/resource_approval_groups/{resource_approval_group_id}/required_approvals`
- Collection only: `no`
- Deprecated: `no`


## Description

Represents the relationship between a Resource and a Resource Approval Group.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resource-requiredapproval-resource | resource | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| requiredapproval-resourceapprovalgroup-required_approvals | required_approvals | - |
| requiredapproval-resource-required_approvals | required_approvals | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | resource | include associated resource |
