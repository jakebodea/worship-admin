# Group

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `group`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/group`
- Resource path: `https://api.planningcenteronline.com/groups/v2/groups`
- Collection only: `no`
- Deprecated: `no`


## Description

A group of people that meet together regularly.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| assign_campuses | https://api.planningcenteronline.com/groups/v2/groups/{group_id}/assign_campuses | - | No content | no |
| disable_chat | https://api.planningcenteronline.com/groups/v2/groups/{group_id}/disable_chat | - | The updated group. | no |
| duplicate | https://api.planningcenteronline.com/groups/v2/groups/{group_id}/duplicate | - | A BatchStatusUrl with a `value` attribute containing the batch status URL. | no |
| enable_chat | https://api.planningcenteronline.com/groups/v2/groups/{group_id}/enable_chat | - | The updated group. | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| archived_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time the group was archived. | public |
| can_create_conversation | boolean (e.g. True) | A boolean representing the current user's authorization to start a new conversation in the group.   Only available when requested with the `?fields` param | public |
| chat_enabled | boolean (e.g. True) | A boolean representing whether or not the group has Chat enabled. | public |
| contact_email | string (e.g. string) | If a contact_email is provided, we will display a contact button on the public page where potential members can ask questions before joining the group. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time the group was created. | public |
| description | string (e.g. string) | A longform description of the group. Can contain HTML markup. | public |
| description_as_plain_text | string (e.g. string) | The plain text version of the group description. | public |
| events_listed | boolean (e.g. True) | Whether or not events are visible to the public on Church Center | public |
| events_visibility | string (e.g. value) | The visibility of events for the group.   Possible values: `public` or `members` | public |
| header_image | hash (e.g. {}) | A hash of header image URLs. The keys are `thumbnail`, `medium`, and `original`.  ```json {   "thumbnail": "https://groups-production.s3.amazonaws.com/uploads/group/header_image/1986065/thumbnail_image-1676676396838.jpg",   "medium": "https://groups-production.s3.amazonaws.com/uploads/group/header_image/1986065/medium_image-1676676396838.jpg",   "original": "https://groups-production.s3.amazonaws.com/uploads/group/header_image/1986065/image-1676676396838.jpg" } ``` | public |
| id | primary_key (e.g. primary_key) | - | public |
| leaders_can_search_people_database | boolean (e.g. True) | Whether or not group leaders have access to the entire church database on the admin side of Groups. (Not recommended) | public |
| listed | boolean (e.g. True) | Whether or not the group is visible on Church Center | public |
| location_type_preference | string (e.g. value) | The location type preference for the group.   Possible values: `physical` or `virtual` | public |
| members_are_confidential | boolean (e.g. True) | Whether or not group members can see other members' info | public |
| memberships_count | integer (e.g. 1) | The number of members in the group, includes leaders. Does not include membership requests. | public |
| name | string (e.g. string) | The name/title of the group. | public |
| public_church_center_web_url | string (e.g. string) | The public URL for the group on Church Center. | public |
| schedule | string (e.g. string) | A text summary of the group's typical meeting schedule. Can be a string like "Sundays at 9:30am" or "Every other Tuesday at 7pm". | public |
| tag_ids | integer (e.g. 1) | The IDs of the tags associated with the group.   Only available when requested with the `?fields` param | public |
| virtual_location_url | string (e.g. string) | The URL for the group's virtual location. A zoom link, for example. This could be set even if `location_type_preference` is `physical`. This is useful if you want to display a zoom link even if the group is meeting in person. | public |
| widget_status | hash (e.g. {}) | DEPRECATED: This is a private attribute used by Home widgets that we plan to remove soon.   Only available when requested with the `?fields` param | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| group_type | group_type | - |
| location | location | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| groupapplication-group-applications | applications | requests to join this group |
| campus-group-campuses | campuses | campuses assigned this group |
| enrollment-group-enrollment | enrollment | enrollment details for this group |
| event-group-events | events | events for this group |
| grouptype-group-group_type | group_type | group type of this group |
| location-group-location | location | default physical location for this group's events |
| membership-group-memberships | memberships | memberships belonging to this group |
| membership-group-my_membership | my_membership | the current person's membership for this group |
| person-group-people | people | people who have memberships for this group |
| resource-group-resources | resources | file and link resources shared with this group |
| tag-group-tags | tags | tags assigned to this group |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| group-campus-groups | groups | groups which have applied this campus |
| group-event-group | group | group which the event belongs to |
| group-groupapplication-group | group | group being applied to |
| group-grouptype-groups | groups | groups belonging to this group type |
| group-location-group | group | group that manages this location |
| group-membership-group | group | group for this membership |
| group-organization-groups | groups | groups for this organization |
| group-person-groups | groups | groups of which this person is a member |
| group-tag-groups | groups | groups which have applied this tag |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | enrollment | include associated enrollment |
|  | group_type | include associated group_type |
|  | location | include associated location |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | chat_enabled | prefix with a hyphen (-chat_enabled) to reverse the order |
|  | contact_email | prefix with a hyphen (-contact_email) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | enrollment_limit | prefix with a hyphen (-enrollment_limit) to reverse the order |
|  | listed | prefix with a hyphen (-listed) to reverse the order |
|  | members_are_confidential | prefix with a hyphen (-members_are_confidential) to reverse the order |
|  | memberships_count | prefix with a hyphen (-memberships_count) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | archive_status | Query on a specific archive_status  Possible values: `not_archived`, `only`, or `include` |
|  | name | Query on a specific name |


## Examples

### Example 1: assign_campuses
- Path: `https://api.planningcenteronline.com/groups/v2/groups/{group_id}/assign_campuses`
```json
{
  "data": {
    "attributes": {
      "campus_ids": [
        "1",
        "2"
      ]
    },
    "type": "GroupAssignCampuses"
  }
}
```

### Example 2: disable_chat
- Path: `https://api.planningcenteronline.com/groups/v2/groups/{group_id}/disable_chat`
```json
{
  "data": {
    "attributes": {
      "confirm": true
    },
    "type": "GroupDisableChat"
  }
}
```
