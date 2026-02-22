# Event

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `event`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/event`
- Resource path: `https://api.planningcenteronline.com/groups/v2/events`
- Collection only: `no`
- Deprecated: `no`


## Description

An event is a meeting of a group. It has a start and end time, and can be
either physical or virtual.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| attendance_requests_enabled | boolean (e.g. True) | This is a group setting that applies to all the events in the group. If selected, an email will be sent to the primary email address of the group leader 60 minutes before the event start time, asking them to report attendance. | public |
| automated_reminder_enabled | boolean (e.g. True) | If `true`, we send an event remind some specified time before the event starts to all members in the group. | public |
| canceled | boolean (e.g. True) | Whether or not the event has been canceled. | public |
| canceled_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time the event was canceled. | public |
| description | string (e.g. string) | A longform description of the event. Can contain HTML markup. | public |
| ends_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time the event ends. | public |
| id | primary_key (e.g. primary_key) | - | public |
| image | hash (e.g. {}) | The image for the event. | public |
| location_type_preference | string (e.g. string) | Either "physical" or "virtual". | public |
| multi_day | boolean (e.g. True) | `true` if the event spans multiple days. Otherwise `false`. | public |
| name | string (e.g. string) | The name/title of the event. | public |
| reminders_sent | boolean (e.g. True) | `true` if reminders have been sent for this event. Otherwise `false`. | public |
| reminders_sent_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time reminders were sent for this event. | public |
| repeating | boolean (e.g. True) | `true` if the event is a repeating event. Otherwise `false`. | public |
| starts_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time the event starts. | public |
| virtual_location_url | string (e.g. string) | The URL for the virtual location. Typically we don't show this URL unless unless the location_type_preference is "virtual". | public |
| visitors_count | integer (e.g. 1) | The number of visitors who attended the event. These are people who are not members of the group. | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| attendance_submitter | attendance_submitter | - |
| group | group | - |
| location | location | - |
| repeating_event | repeating_event | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attendance-event-attendances | attendances | attendances recorded for this event |
| group-event-group | group | group which the event belongs to |
| location-event-location | location | physical location of the event |
| eventnote-event-notes | notes | notes added to the event |
| rsvp-event-rsvps | rsvps | RSVP responses for the event |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-group-events | events | events for this group |
| event-grouptype-events | events | events of groups with this group type |
| event-organization-events | events | events for all groups in this organization |
| event-person-events | events | events of groups which this person is a member |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | group | include associated group |
|  | location | include associated location |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ends_at | prefix with a hyphen (-ends_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | starts_at | prefix with a hyphen (-starts_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | ends_at | Query on a specific ends_at |
|  | name | Query on a specific name |
|  | starts_at | Query on a specific starts_at |
