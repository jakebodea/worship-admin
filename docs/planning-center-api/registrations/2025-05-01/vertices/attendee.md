# Attendee

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `attendee`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/attendee`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/signups/{signup_id}/attendees`
- Collection only: `no`
- Deprecated: `no`


## Description

An `Attendee` is a person registered for a signup.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| complete | boolean (e.g. True) | Whether or not attendee has completed all necessary items (personal information, questions, forms, add ons).   Only available when requested with the `?fields` param | public |
| active | boolean (e.g. True) | Whether or not the attendee is active. | public |
| canceled | boolean (e.g. True) | Whether or not the attendee is canceled. | public |
| waitlisted | boolean (e.g. True) | Whether or not the attendee is waitlisted. | public |
| waitlisted_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the attendee was waitlisted. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| emergencycontact-attendee-emergency_contact | emergency_contact | - |
| person-attendee-person | person | - |
| registration-attendee-registration | registration | - |
| selectiontype-attendee-selection_type | selection_type | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attendee-signup-attendees | attendees | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | emergency_contact | include associated emergency_contact |
|  | person | include associated person |
|  | registration | include associated registration |
|  | selection_type | include associated selection_type |
