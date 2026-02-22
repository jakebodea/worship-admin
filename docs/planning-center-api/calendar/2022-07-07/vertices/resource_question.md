# ResourceQuestion

- App: `calendar`
- Version: `2022-07-07`
- Vertex ID: `resource_question`
- Endpoint: `https://api.planningcenteronline.com/calendar/v2/documentation/2022-07-07/vertices/resource_question`
- Resource path: `https://api.planningcenteronline.com/calendar/v2/resource_questions`
- Collection only: `no`
- Deprecated: `no`


## Description

A question to answer when requesting to book a room or resource.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| choices | string (e.g. string) | If `kind` is `dropdown`, represents a string of dropdown choices separated by the `\|` character | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the question was created | public |
| description | string (e.g. string) | Optional description of the question | public |
| id | primary_key (e.g. primary_key) | Unique identifier for the question | public |
| kind | string (e.g. string) | Possible values: - `dropdown`: predefined list of choices as an answer - `paragraph`: expected answer is a paragraph - `text`: expected answer is a sentence - `yesno`: expected answer is 'Yes' or 'No'  - `section_header`: used to separate questions in the UI, no expected answer | public |
| multiple_select | boolean (e.g. True) | If `kind` is `dropdown`, `true` indicates that more than one selection is permitted | public |
| optional | boolean (e.g. True) | - `true` indicates answering the question is not required when booking - `false` indicates answering the question is required when booking | public |
| position | integer (e.g. 1) | Position of question in list in the UI | public |
| question | string (e.g. string) | The question to be answered | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | UTC time at which the question was updated | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| resource | resource | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| resourcequestion-organization-resource_questions | resource_questions | - |
| resourcequestion-resource-resource_questions | resource_questions | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | kind | Query on a specific kind |
|  | updated_at | Query on a specific updated_at |
