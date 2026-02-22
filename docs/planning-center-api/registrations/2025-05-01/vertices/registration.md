# Registration

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `registration`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/registration`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/signups/{signup_id}/registrations`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-registration-created_by | created_by | - |
| person-registration-registrant_contact | registrant_contact | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| registration-attendee-registration | registration | - |
| registration-signup-registrations | registrations | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_by | include associated created_by |
|  | registrant_contact | include associated registrant_contact |
