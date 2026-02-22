# Planning Center People

Planning Center People helps you manage contact data, membership info, and everything you need to know about your people with confidence.


## App

- App slug: `people`
- Base docs endpoint: `https://api.planningcenteronline.com/people/v2/documentation`


## Versions

| Version | Beta | Details |
| --- | --- | --- |
| 2025-11-10 | no | Remove `gender` relationship from `Person` |
| 2025-07-17 | no | Set 'name' attribute as auto-generated name if no manually set name is present |
| 2025-07-02 | no | Remove `note_category` relationship and allow creating profile note by assigning `note_category_id` |
| 2025-03-20 | no | Prevent archived workflows from the `Workflow` association |
| 2024-09-12 | no | Excludes total counts from `meta` section for single resources in `List`,`Form` and `Workflow` |
| 2023-03-21 | no | First public version of the Background Checks API |
| 2023-02-15 | no | Change `display_value` attribute in `FormSubmissionValue` |
| 2022-07-14 | no | Change `gender` attribute in `Person` |
| 2022-01-28 | no | Remove `slug` as an assignable attribute from `Tab` |
| 2022-01-05 | no | Remove `all` filter from `Message`'s `Person` association |
| 2021-08-17 | no | Remove `note_count` and `note_person_count` attributes from `NoteCategory` |
| 2020-07-22 | no | Change `school_type` attribute in `Person` |
| 2020-04-06 | no | Remove `total_snoozed_card_count` attribute from `WorkflowStep` |
| 2019-10-10 | no | Remove `owner` include from `List` |
| 2019-01-14 | no | Change `time_zone` attribute in `Campus` |
| 2018-08-01 | no | The first available version of the API |
