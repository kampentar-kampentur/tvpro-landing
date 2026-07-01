# Project Rules & Constraints

## Coding Rules
- **NEVER use browser `alert()`, `confirm()`, or `prompt()` dialogs** for displaying errors, warnings, validation failures, or success states in UI/web code.
- Always implement inline form validation using React state, highlighting invalid input borders (e.g. adding `.invalid` class), and displaying red descriptive error texts directly under the inputs.
- Display network/API submission errors as inline status messages in the form itself (above/below submit buttons) instead of popup alert dialogs.
