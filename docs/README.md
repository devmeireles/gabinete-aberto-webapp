# Development guides

These files guide agents working on Gabinete Aberto. They describe the current
repository, not a target architecture. Update guides from verified source changes;
do not change application code to make it match an outdated guide.

Start with root `AGENTS.md`, then use:

| Guide                                           | Purpose                                                    |
| ----------------------------------------------- | ---------------------------------------------------------- |
| [Development workflow](development-workflow.md) | Discovery, local setup, build, checks, and manual testing  |
| [Architecture](architecture.md)                 | Routes, directories, rendering, and state ownership        |
| [Guardrails](guardrails.md)                     | Scope, boundaries, and reporting rules                     |
| [Data access](data-access.md)                   | Transport, contracts, dependencies, and cache behavior     |
| [Data-access rules](data-access-rules.md)       | Query invariants and source/environment boundaries         |
| [Component guidelines](component-guidelines.md) | Placement, component contracts, and reuse                  |
| [Composition patterns](composition-pattern.md)  | Existing table/controller and provider composition         |
| [Design system rules](design-system-rules.md)   | Styling conventions and current limitations                |
| [Design tokens](design-tokens.md)               | Token inventory, theme selectors, and global overlaps      |
| [Accessibility](accessibility.md)               | Existing semantics, manual review targets, and limitations |

Each guide distinguishes implemented behavior from limitations or recommendations.
