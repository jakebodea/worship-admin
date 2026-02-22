# Organization

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/groups/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

The organization represents a single church. Every other resource is scoped to this record.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | The name of the organization. | public |
| time_zone | string (e.g. string) | The time zone of the organization. | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-organization-campuses | campuses | campuses for this organization |
| event-organization-events | events | events for all groups in this organization |
| groupapplication-organization-group_applications | group_applications | requests to join groups for this organization |
| grouptype-organization-group_types | group_types | group types for this organization |
| group-organization-groups | groups | groups for this organization |
| person-organization-people | people | people for this organization |
| taggroup-organization-tag_groups | tag_groups | tag groups in this organization |
