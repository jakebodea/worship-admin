# TextSetting

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `text_setting`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/text_setting`
- Resource path: `https://api.planningcenteronline.com/services/v2/people/{person_id}/text_settings`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| carrier | string (e.g. string) | - | public |
| display_number | string (e.g. string) | - | public |
| general_emails_enabled | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| normalized_number | string (e.g. string) | - | public |
| reminders_enabled | boolean (e.g. True) | - | public |
| scheduling_replies_enabled | boolean (e.g. True) | - | public |
| scheduling_requests_enabled | boolean (e.g. True) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| textsetting-person-text_settings | text_settings | - |
