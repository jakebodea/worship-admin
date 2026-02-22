# Person

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `person`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/person`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/signups/{signup_id}/attendees/{attendee_id}/person`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| first_name | string (e.g. string) | - | public |
| last_name | string (e.g. string) | - | public |
| name | string (e.g. string) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-attendee-person | person | - |
| person-registration-created_by | created_by | - |
| person-registration-registrant_contact | registrant_contact | - |
