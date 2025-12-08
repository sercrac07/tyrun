# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.0.3 - 2025-12-08

### Added

- Initial release
- Runtime schema factories:
  - Primitives: `string` (`nonEmpty`, `min`, `max`, `regex`, `email`, `url`), `number` (`min`, `max`, `integer`, `positive`, `negative`), `bigint` (`min`, `max`, `positive`, `negative`), `boolean`, `symbol`, `undefined`, `null`, `literal`, `date` (`min`, `max`), `file` (`min`, `max`, `mime`)
  - Structural: `array` (`nonEmpty`, `min`, `max`), `object`, `enum`, `record`, `tuple`
  - Special: `any`, `booleanish` (configurable `trueValues`/`falseValues`), `union`, `intersection`, `lazy`, `mutate`
  - Utility: `optional`, `nullable`, `nullish`
- Core parsing APIs: `parse`, `parseAsync`, `safeParse`, `safeParseAsync`
- Pipeline features: `preprocess`, `validate`, `process`, `default`, `fallback`, `clone`
- Error model: `TyrunError` with `Issue[]`, `TyrunRuntimeError`; constants `ERRORS` and `CODES`
- Type utilities: `Input`, `Output`, `InputShape`, `OutputShape`, `InputIntersection`, `OutputIntersection`, `Default`, `Validator`, `Processor`, `Preprocessor`, `Mutator`, `MaybePromise`, `Prettify`
- Test suite with `vitest` covering primitives, structural and special schemas
- Package exports: default `t` (schemas), `constants`, `errors`, `T` (types)
- Documentation: README with Quick Start and examples
