# Feed

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `feed`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/feed`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/feeds`
- Collection only: `no`
- Deprecated: `no`


## Description

A feed belonging to an organization.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| can_delete | boolean (e.g. True) | - | public |
| default_church_center_visibility | string (e.g. value) | Possible values: `hidden` or `published` | public |
| deleting | boolean (e.g. True) | - | public |
| feed_type | string (e.g. value) | Possible values: `registrations`, `groups`, `ical`, or `form` | public |
| id | primary_key (e.g. primary_key) | - | public |
| imported_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| name | string (e.g. string) | - | public |
| prefix_event_names | boolean (e.g. True) | Only available when requested with the `?fields` param | public |
| source_id | primary_key (e.g. primary_key) | - | public |
| sync_campus_tags | boolean (e.g. True) | Only available when requested with the `?fields` param | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event_owner | event_owner | - |
| default_calendar | default_calendar | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| feed-event-feed | feed | - |
| feed-organization-feeds | feeds | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | feed_type | Query on a specific feed_type  Possible values: `registrations`, `groups`, `ical`, or `form` |
|  | source_id | Query on a specific source_id |
