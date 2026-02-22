# Person

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `person`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/person`
- Resource path: `https://api.planningcenteronline.com/groups/v2/people`
- Collection only: `no`
- Deprecated: `no`


## Description

A person is a user of Planning Center.
They can be a member of a group, a leader of a group, or an administrator.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| addresses | array (e.g. []) | Returns all the addresses associated with this person. | public |
| avatar_url | string (e.g. string) | The URL of the person's avatar. | public |
| child | boolean (e.g. True) | Whether or not the person is under 13 years old. This is false if a birthdate is not set.   Only available when requested with the `?fields` param | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | Date and time this person was first created in Planning Center | public |
| email_addresses | array (e.g. []) | Returns all the email addresses associated with this person.  ```json [{   "address": "sam@example.com",   "location": "Home",   "primary": true }] ``` | public |
| first_name | string (e.g. string) | The person's first name. | public |
| id | primary_key (e.g. primary_key) | - | public |
| last_name | string (e.g. string) | The person's last name. | public |
| permissions | string (e.g. string) | Can be `administrator`, `group_type_manager`, `leader`, `member`, or `no access`. | public |
| phone_numbers | array (e.g. []) | Returns all the phone numbers associated with this person.  ```json [{   "number": "(800) 123-4567",   "carrier": null,   "location": "Mobile",   "primary": true }] ``` | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-person-events | events | events of groups which this person is a member |
| group-person-groups | groups | groups of which this person is a member |
| membership-person-memberships | memberships | memberships for this person |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-attendance-person | person | person belonging to this attendance |
| person-groupapplication-person | person | person who applied |
| person-group-people | people | people who have memberships for this group |
| person-membership-person | person | - |
| person-organization-people | people | people for this organization |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | first_name | Query on a specific first_name |
|  | last_name | Query on a specific last_name |
