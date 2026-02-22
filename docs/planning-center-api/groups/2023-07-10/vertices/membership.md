# Membership

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `membership`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/membership`
- Resource path: `https://api.planningcenteronline.com/groups/v2/groups/{group_id}/memberships`
- Collection only: `no`
- Deprecated: `no`


## Description

The state of a `Person` belonging to a `Group`.

A `Person` can only have one active `Membership` to a `Group` at a time.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| joined_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time the person joined the group. | public |
| role | string (e.g. string) | The role of the person in the group. Possible values: `member` or `leader` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| group | group | - |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| group-membership-group | group | group for this membership |
| person-membership-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| membership-group-memberships | memberships | memberships belonging to this group |
| membership-group-my_membership | my_membership | the current person's membership for this group |
| membership-person-memberships | memberships | memberships for this person |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | joined_at | prefix with a hyphen (-joined_at) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
|  | role | prefix with a hyphen (-role) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | role | Query on a specific role |
