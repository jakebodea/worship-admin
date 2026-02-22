# RoomSetup

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `room_setup`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/room_setup`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/room_setups`
- Collection only: `no`
- Deprecated: `no`


## Description

A diagram and list of suggested resources useful for predefined room setups.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the room setup was created | public |
| description | string (e.g. string) | A description of the room setup | public |
| diagram | string (e.g. string) | An object containing `url` and `thumbnail`.  `url` is path to where room setup is stored. `thumbnail` contains `url` path to where thumbnail is stored. | public |
| diagram_thumbnail_url | string (e.g. string) | Path to where thumbnail version of room setup is stored | public |
| diagram_url | string (e.g. string) | Path to where room setup is stored | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the room setup | public |
| name | string (e.g. string) | The name of the room setup | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the room setup was updated | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| room_setup | room_setup | - |
| resource_suggestions | resource_suggestions | - |
| containing_resource | containing_resource | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| containingresource-roomsetup-containing_resource | containing_resource | - |
| resourcesuggestion-roomsetup-resource_suggestions | resource_suggestions | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| roomsetup-eventresourcerequest-room_setup | room_setup | - |
| roomsetup-organization-room_setups | room_setups | - |
| roomsetup-resource-room_setups | room_setups | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | containing_resource | include associated containing_resource |
|  | resource_suggestions | include associated resource_suggestions |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
