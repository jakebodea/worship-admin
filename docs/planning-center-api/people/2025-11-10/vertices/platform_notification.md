# PlatformNotification

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `platform_notification`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/platform_notification`
- Resource path: `https://api.planningcenteronline.com/people/v2/people/{person_id}/platform_notifications`
- Collection only: `no`
- Deprecated: `no`


## Description

A Platform Notification is a suite-wide notification that shows at the top of each application's screen until dismissed by the user.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| html | string (e.g. string) | - | public |
| id | primary_key (e.g. primary_key) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| platformnotification-person-platform_notifications | platform_notifications | - |
