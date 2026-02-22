# Enrollment

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `enrollment`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/enrollment`
- Resource path: `https://api.planningcenteronline.com/groups/v2/groups/{group_id}/enrollment`
- Collection only: `no`
- Deprecated: `no`


## Description

Details on how and when members can join a `Group`.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| auto_closed | boolean (e.g. True) | Whether or not enrollment has been closed automatically due to set limits | public |
| auto_closed_reason | string (e.g. string) | Brief description as to which limit automatically closed enrollment | public |
| date_limit | string (e.g. string) | Date when enrollment should automatically close | public |
| date_limit_reached | boolean (e.g. True) | Whether or not the `date_limit` has been reached | public |
| id | primary_key (e.g. primary_key) | - | public |
| member_limit | integer (e.g. 1) | Total number of members allowed before enrollment should automatically close | public |
| member_limit_reached | boolean (e.g. True) | Whether or not the `member_limit` has been reached | public |
| status | string (e.g. string) | Current enrollment status. Possible values: * `open` - strategy is not `closed` and no limits have been reached * `closed` - strategy is `closed` _or_ limits have been reached * `full` - member limit has been reached * `private` - group is unlisted | public |
| strategy | string (e.g. string) | Sign up strategy. Possible values: `request_to_join`, `open_signup`, or `closed` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| group | group | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| enrollment-group-enrollment | enrollment | enrollment details for this group |
