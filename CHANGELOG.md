# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.2.0 - 2025-09-05

### Added

- `file` validator

## 2.1.0 - 2025-09-05

### Added

- `mutation` method on `optional`, `nullable` and `nullish` schemas
- `inner` property for `optional`, `nullable` and `nullish` schemas
- `date` validator

### Fixed

- `boolean` validator not running validators

## 2.0.0 - 2025-09-04

### Added

- `type` property for all validators to store validator type
- `coerce` method for `string`, `number` and `boolean` validators
- `refine` method for all validators to add custom validation logic
- `transform` method for all validators to add custom transformation logic
- `mutate` method for all validators to add custom mutation logic
- `T.Input` type to get input type for validator

### Changed

- Refactor classes to explicitily mark public methods
- Refactor `optional`, `nullable`, `nullish` schemas to inherit from base schema
- Rename `T.Infer` to `T.Output`

## 1.5.0 - 2025-09-01

### Added

- `meta` property for all validators to store custom metadata

### Changed

- Export all types as `T`

## 1.4.0 - 2025-08-31

### Added

- `inner` property for _object_, _array_ and _record_ validators to access inner schemas configurations
- `values` property for _enum_ validator to access enum configuration

## 1.3.0 - 2025-08-31

### Added

- _Union_ validation support

## 1.2.0 - 2025-08-31

### Added

- _Records_ validation support

## 1.1.0 - 2025-08-30

### Added

- _Enums_ validation support

## 1.0.0 - 2025-08-29

### Added

- First stable version
- Runtime type validation
- Validation support for _strings_, _numbers_, _booleans_, _objects_ and _arrays_
- String validation methods: _min_, _max_, _regex_
- Number validation methods: _min_, _max_
- Array validation methods: _min_, _max_
- Optional types support
- Null types support
- Nullish types support
- TypeScript interfaces
- Custom error messages
