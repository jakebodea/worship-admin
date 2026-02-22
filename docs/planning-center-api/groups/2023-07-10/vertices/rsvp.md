# RSVP

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `rsvp`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/rsvp`
- Resource path: `https://api.planningcenteronline.com/groups/v2/events/{event_id}/rsvps`
- Collection only: `yes`
- Deprecated: `no`


## Description

A person's RSVP response for a group event.
RSVPs can be submitted at any point leading up to the event.
When an event reminder is sent, `awaiting_response` RSVPs are generated for
any remaining members, or `not_sent` if they're missing an email address.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| response | string (e.g. value) | Possible values: `awaiting_response`, `yes`, `no`, `maybe`, or `not_sent` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |
| group | group | - |
| person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| rsvp-event-rsvps | rsvps | RSVP responses for the event |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | response | prefix with a hyphen (-response) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | response | Query on a specific response  Possible values: `awaiting_response`, `yes`, `no`, `maybe`, or `not_sent` |
