# Location

- App: `groups`
- Version: `2023-07-10`
- Vertex ID: `location`
- Endpoint: `https://api.planningcenteronline.com/groups/v2/documentation/2023-07-10/vertices/location`
- Resource path: `https://api.planningcenteronline.com/groups/v2/events/{event_id}/location`
- Collection only: `no`
- Deprecated: `no`


## Description

A physical event location


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| display_preference | string (e.g. value) | This preference controls how the location is displayed to non-members for public groups and events.   Possible values: `hidden`, `approximate`, or `exact` | public |
| full_formatted_address | string (e.g. string) | Ex: "1313 Disneyland Dr Anaheim, CA 92802" (may be approximate or `null`) Approximate address would be "Anaheim, CA 92802". We obscure Canadian zip codes. | public |
| id | primary_key (e.g. primary_key) | - | public |
| latitude | float (e.g. 1.42) | Ex: `33.815396` (may be approximate or `null`) | public |
| longitude | float (e.g. 1.42) | Ex: `-117.926399` (may be approximate or `null`) | public |
| name | string (e.g. string) | Ex: "Disneyland" | public |
| radius | string (e.g. string) | The number of miles in a location's approximate address. Will be `0` if the strategy is exact, and will be `null` if the strategy is hidden. | public |
| strategy | string (e.g. string) | The display preference strategy used for the current request, based on user permissions. Either `hidden`, `approximate`, or `exact`. | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| group-location-group | group | group that manages this location |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| location-event-location | location | physical location of the event |
| location-group-location | location | default physical location for this group's events |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | group | include associated group |
