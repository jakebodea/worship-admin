# EmergencyContact

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `emergency_contact`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/emergency_contact`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/signups/{signup_id}/attendees/{attendee_id}/emergency_contact`
- Collection only: `no`
- Deprecated: `no`


## Description

`Emergency_Contact` is the person assigned as the emergency contact for an attendee.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| phone_number | string (e.g. string) | Phone number of the emergency contact person. | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| emergencycontact-attendee-emergency_contact | emergency_contact | - |
