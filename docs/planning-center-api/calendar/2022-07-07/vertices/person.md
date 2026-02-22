# Person

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `person`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/person`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/people`
- Collection only: `no`
- Deprecated: `no`


## Description

The people in your organization with access to Calendar.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| avatar_url | string (e.g. string) | Path to where the avatar image is stored | public |
| can_edit_people | boolean (e.g. True) | Indicates whether the person can edit other people | public |
| can_edit_resources | boolean (e.g. True) | Indicates whether the person can edit resources | public |
| can_edit_rooms | boolean (e.g. True) | Indicates whether the person can edit rooms | public |
| child | boolean (e.g. True) | Indicates whether the person is a child | public |
| contact_data | string (e.g. string) | An object containing the person's contact data.  This can include an array of `email_addresses`, `addresses` and `phone_numbers` | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the person was created | public |
| event_permissions_type | string (e.g. string) | Event permissions for the person | public |
| first_name | string (e.g. string) | The person's first name | public |
| gender | string (e.g. string) | `M` indicates male, `F` indicates female | public |
| has_access | boolean (e.g. True) | Indicates whether the person has access to Calendar | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the person | public |
| last_name | string (e.g. string) | The person's last name | public |
| member_of_approval_groups | boolean (e.g. True) | Indicates whether the person is a member of at least one approval group  Only available when requested with the `?fields` param | public |
| middle_name | string (e.g. string) | The person's middle name | public |
| name | string (e.g. string) | The person's first name, last name, and name suffix | public |
| name_prefix | string (e.g. string) | Possible values: - `Mr.` - `Mrs.` - `Ms.` - `Miss` - `Dr.` - `Rev.` | public |
| name_suffix | string (e.g. string) | Possible values: - `Jr.` - `Sr.` - `Ph.D.` - `II` - `III` | public |
| pending_request_count | integer (e.g. 1) | If the person is a member of an approval group, the number of EventResourceRequests needing resolution.  If `resolves_conflicts` is `true`, the count will also include the number of Conflicts needing resolution. | public |
| people_permissions_type | string (e.g. string) | People permissions for the person | public |
| permissions | integer (e.g. 1) | Integer that corresponds to the person's permissions in Calendar | public |
| resolves_conflicts | boolean (e.g. True) | Indicates whether the person is able to resolve Conflicts | public |
| resources_permissions_type | string (e.g. string) | Resource permissions for the person | public |
| room_permissions_type | string (e.g. string) | Room permissions for the person | public |
| site_administrator | boolean (e.g. True) | Indicates whether the person is a Organization Administrator | public |
| status | string (e.g. value) | Possible values: - `active`: The person is marked "active" in People - `inactive`: The person is marked "inactive" in People   Possible values: `active`, `pending`, or `inactive` | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the person was updated | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventresourcerequest-person-event_resource_requests | event_resource_requests | - |
| organization-person-organization | organization | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-conflict-resolved_by | resolved_by | - |
| person-event-owner | owner | - |
| person-eventresourcerequest-created_by | created_by | - |
| person-eventresourcerequest-updated_by | updated_by | - |
| person-organization-people | people | - |
| person-resourceapprovalgroup-people | people | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | organization | include associated organization |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
|  | resolves_conflicts | prefix with a hyphen (-resolves_conflicts) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | first_name | Query on a specific first_name |
|  | last_name | Query on a specific last_name |
|  | middle_name | Query on a specific middle_name |
|  | updated_at | Query on a specific updated_at |
