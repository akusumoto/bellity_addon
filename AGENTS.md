# Instructions for Codex

## Design Document Structure

- Write all project documentation in English, including design documents in `spec/`, the user-facing `README.md`, and verification records in `tests/`.
- Place all design documents in `spec/`.
- Treat `spec/README.md` as the main design document, describing the overall purpose of the addon, its structure, common specifications, a list of weapons, and the installation/verification policy.
- Document the details of each item in `spec/<item_id>.md` (one file per item). Summarize the ID, display name, performance, recipes, special abilities, implementation files, and device verification items in that file.
- Link to each item's design document from the weapon list in the main design document. Do not duplicate weapon-specific details in the main design document.
- When specifications change due to recipe additions or bug fixes, update the corresponding main design document or item design document. Do not create new design documents exclusively for recipes or revision histories.
- Treat `README.md` as an installation guide for users, and `tests/test_checklist.md` as a record of device verification. Document design decisions in `spec/`.

## Checks When Making Changes

- Before starting work, read the related design documents and implementations. If there are discrepancies, reorganize them to match the current requirements.
- When adding an item, create an individual design document and update the list and links in `spec/README.md`.
- After making changes, ensure that no outdated descriptions or broken links remain. Do not state that an unverified in-game behavior has been verified.
- Do not build an `.mcaddon` package automatically. If packaging is needed, ask the user before building it.

## Utilizing Sub-Agents

- Delegate concrete tasks that can proceed independently, such as implementation, testing, and minor document corrections, to lower-level sub-agents.
- When delegating, clarify the scope of responsibility and expected outcomes to prevent multiple agents from editing the same file simultaneously.
- The main agent is responsible for confirming and integrating the results, ensuring overall consistency, and performing the final verification.
