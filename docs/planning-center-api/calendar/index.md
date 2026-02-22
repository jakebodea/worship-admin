# Planning Center Calendar

Reserve rooms, publish event calendars, and revolutionize the way you allocate your church’s resources.


## App

- App slug: `calendar`
- Base docs endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation`


## Versions

| Version | Beta | Details |
| --- | --- | --- |
| 2022-07-07 | no | Renamed recurrence_description attribute on `EventInstance` to compact_recurrence_description. |
| 2021-07-20 | no | Removed the deprecated archived_at attribute from `Event`. Renamed details attribute on `Event` to summary. Removed percent_approved from `EventResourceRequest`. Renamed room_setup_info attribute on `EventResourceRequest` to notes. |
| 2020-04-08 | no | Renamed path to folder_path on `Resource` and `ResourceFolder`. Changed available includes on `Tag` and `Resource`. |
| 2018-08-01 | no | The first available version of the API |
