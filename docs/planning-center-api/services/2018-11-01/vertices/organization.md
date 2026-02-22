# Organization

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/services/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

The root level of an organization where account-level settings are applied.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| allow_mp3_download | boolean (e.g. True) | - | public |
| beta | boolean (e.g. True) | - | beta |
| calendar_starts_on_sunday | boolean (e.g. True) | - | public |
| ccli | string (e.g. string) | - | public |
| ccli_auto_reporting_enabled | boolean (e.g. True) | - | public |
| ccli_connected | boolean (e.g. True) | - | public |
| ccli_reporting_enabled | boolean (e.g. True) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| date_format | integer (e.g. 1) | Two possible values, `US` `EU` | public |
| extra_file_storage_allowed | boolean (e.g. True) | - | public |
| file_storage_exceeded | boolean (e.g. True) | - | public |
| file_storage_extra_charges | integer (e.g. 1) | - | public |
| file_storage_extra_enabled | boolean (e.g. True) | - | public |
| file_storage_size | boolean (e.g. True) | - | public |
| file_storage_size_used | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| legacy_id | primary_key (e.g. primary_key) | - | public |
| music_stand_enabled | boolean (e.g. True) | - | public |
| name | string (e.g. string) | - | public |
| owner_name | string (e.g. string) | - | public |
| people_allowed | integer (e.g. 1) | - | public |
| people_remaining | integer (e.g. 1) | - | public |
| projector_enabled | boolean (e.g. True) | - | public |
| rehearsal_mix_enabled | boolean (e.g. True) | - | public |
| rehearsal_pack_connected | boolean (e.g. True) | - | public |
| required_to_set_download_permission | string (e.g. string) | Possible values: `editor`, `administrator`, `site_administrator` | public |
| secret | string (e.g. string) | - | public |
| time_zone | string (e.g. string) | - | public |
| twenty_four_hour_time | boolean (e.g. True) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachmenttype-organization-attachment_types | attachment_types | - |
| chat-organization-chat | chat | - |
| emailtemplate-organization-email_templates | email_templates | - |
| folder-organization-folders | folders | - |
| media-organization-media | media | - |
| person-organization-people | people | - |
| organization-organization-plans | plans | - |
| reporttemplate-organization-report_templates | report_templates | - |
| series-organization-series | series | - |
| servicetype-organization-service_types | service_types | - |
| song-organization-songs | songs | - |
| taggroup-organization-tag_groups | tag_groups | - |
| team-organization-teams | teams | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| organization-organization-plans | plans | - |
