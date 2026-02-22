# Tag

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `tag`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/tag`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/tags`
- Collection only: `no`
- Deprecated: `no`


## Description

An organizational tag that can be applied to events.

Applied tags can be used to filter events on the calendar or
filter events for reports, iCal feeds, kiosk, and the widget.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| church_center_category | boolean (e.g. True) | `true` indicates that this tag is used as a category on Church Center | public |
| color | string (e.g. string) | Hex color code of the tag | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the tag was created | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the tag | public |
| name | string (e.g. string) | The tag name | public |
| position | float (e.g. 1.42) | If the tag belongs to a TagGroup, position indicates place in list within TagGroup in the UI.  If the tag does not belong to a TagGroup, position indicates place in list under "Individual Tags" in the UI. | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the tag was updated | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventinstance-tag-event_instances | event_instances | - |
| event-tag-events | events | - |
| taggroup-tag-tag_group | tag_group | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| tag-eventinstance-tags | tags | - |
| tag-event-tags | tags | - |
| tag-organization-tags | tags | - |
| tag-taggroup-tags | tags | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | tag_group | include associated tag_group |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | position | prefix with a hyphen (-position) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | church_center_category | Query on a specific church_center_category |
|  | color | Query on a specific color |
|  | created_at | Query on a specific created_at |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
|  | position | Query on a specific position |
|  | updated_at | Query on a specific updated_at |
