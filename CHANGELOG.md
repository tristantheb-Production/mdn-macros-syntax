# Changelog

## [0.3.1](https://github.com/tristantheb/mdn-macros-syntax/compare/v0.3.0...v0.3.1) (2025-10-29)


### Enhancements

* **ci:** don't trigger CD/CI for text and yml files ([#28](https://github.com/tristantheb/mdn-macros-syntax/issues/28)) ([15c42be](https://github.com/tristantheb/mdn-macros-syntax/commit/15c42be1624741b0c10f5f30ba6e9b1c50d6a98c))
* **ci:** removed manual build mode on codeql ([#27](https://github.com/tristantheb/mdn-macros-syntax/issues/27)) ([9c57ab2](https://github.com/tristantheb/mdn-macros-syntax/commit/9c57ab27c0c8ec2fcc9ae8f2ffd7f199e6ae7733))


### Bug Fixes

* **fetch:** sha commit request fail without reset ([#24](https://github.com/tristantheb/mdn-macros-syntax/issues/24)) ([5af2db2](https://github.com/tristantheb/mdn-macros-syntax/commit/5af2db2ac73fb6188f42703f0ab8fd7e4851d35e))

## [0.3.0](https://github.com/tristantheb/mdn-macros-syntax/compare/v0.2.1...v0.3.0) (2025-10-26)


### Features

* **macros:** implement CSSSyntaxRaw ([#19](https://github.com/tristantheb/mdn-macros-syntax/issues/19)) ([eec2c35](https://github.com/tristantheb/mdn-macros-syntax/commit/eec2c35a5d315590a33f76152f05ad3975bfe6f6))


### Bug Fixes

* **macros:** EmbedLiveSample have missing parameters ([#21](https://github.com/tristantheb/mdn-macros-syntax/issues/21)) ([ab7f071](https://github.com/tristantheb/mdn-macros-syntax/commit/ab7f071a9c527a78d77303d4576384af63d9267c))
* **snippets:** inline macros create empty parentheses ([#22](https://github.com/tristantheb/mdn-macros-syntax/issues/22)) ([2b740f0](https://github.com/tristantheb/mdn-macros-syntax/commit/2b740f0c5aba9928313cd8126b524144eeec9df7))

## [0.2.1](https://github.com/tristantheb/mdn-macros-syntax/compare/v0.2.0...v0.2.1) (2025-10-24)


### Enhancements

* disable macros marked as deprecated on snippet list ([d923024](https://github.com/tristantheb/mdn-macros-syntax/commit/d9230245da1cbbbb8c624089cd907494af4184a5))
* **locales:** implement locales for macros hover (`es`, `fr`, `ja`, `ko`, `pt-br`, `ru`, `zh-cn`, `zh-tw`) ([#18](https://github.com/tristantheb/mdn-macros-syntax/issues/18)) ([ff07098](https://github.com/tristantheb/mdn-macros-syntax/commit/ff07098a02ba960079905de165c555aff03f2c1b))
* **snippet:** disable macros marked as deprecated on snippet list ([#16](https://github.com/tristantheb/mdn-macros-syntax/issues/16)) ([d923024](https://github.com/tristantheb/mdn-macros-syntax/commit/d9230245da1cbbbb8c624089cd907494af4184a5))


### Miscellaneous

* **deps-dev:** bump the development-dependencies group with 4 updates ([#13](https://github.com/tristantheb/mdn-macros-syntax/issues/13)) ([88e04d8](https://github.com/tristantheb/mdn-macros-syntax/commit/88e04d8aeeae0735a376a51b6cdb53d52a93007d))
* update documentations of extension and macros ([#14](https://github.com/tristantheb/mdn-macros-syntax/issues/14)) ([6da091c](https://github.com/tristantheb/mdn-macros-syntax/commit/6da091c8bf774e9913a553bb48761a7cf6ff7700))
* update readme to display gif on example ([#17](https://github.com/tristantheb/mdn-macros-syntax/issues/17)) ([3c9c1d9](https://github.com/tristantheb/mdn-macros-syntax/commit/3c9c1d9785a931846e6116330ace4d32cd2100df))

## [0.2.0](https://github.com/tristantheb-Production/mdn-macros-syntax/compare/v0.1.1...v0.2.0) (2025-10-23)


### Features

* **component:** implementation of the hash commit update ([#10](https://github.com/tristantheb-Production/mdn-macros-syntax/issues/10)) ([6c41624](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/6c416248fbdec46b46525cd1c8c0d2bc8dbb3218))


### Enhancements

* **components:** move elements of providers as components ([#8](https://github.com/tristantheb-Production/mdn-macros-syntax/issues/8)) ([fc49e43](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/fc49e43ffd5353af7c4a4ad280cdaa2caa96b846))
* improve extension loading to detect repository ([#9](https://github.com/tristantheb-Production/mdn-macros-syntax/issues/9)) ([5a90319](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/5a90319187272c3a4e57a4ba7ef5a509241dae71))
* **linter:** change eslint rules ([#11](https://github.com/tristantheb-Production/mdn-macros-syntax/issues/11)) ([f9c9a06](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/f9c9a06f1f1f73900bcd9bccdff7c8f38713a249))
* linting all files and cleaning code ([#4](https://github.com/tristantheb-Production/mdn-macros-syntax/issues/4)) ([72e07d1](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/72e07d1cdced7394c8971b7b8c890e4f5b8e70b8))


### Bug Fixes

* github action fail need to be separated ([#5](https://github.com/tristantheb-Production/mdn-macros-syntax/issues/5)) ([953bfa1](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/953bfa1040f90819999ab8f63fcfc7665b1bc13a))


### Miscellaneous

* **deps-dev:** bump eslint from 9.37.0 to 9.38.0 in the development-dependencies group ([#7](https://github.com/tristantheb-Production/mdn-macros-syntax/issues/7)) ([5ee8f48](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/5ee8f4874088301412c5e679dcb70fded5568e85))
* **deps-dev:** bump eslint in the development-dependencies group ([5ee8f48](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/5ee8f4874088301412c5e679dcb70fded5568e85))
* updating readme with new hash component ([#12](https://github.com/tristantheb-Production/mdn-macros-syntax/issues/12)) ([dea3c3e](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/dea3c3e53c31413ecfbc6837ce5ec5d0edd69de1))

## [0.1.1](https://github.com/tristantheb-Production/mdn-macros-syntax/compare/v0.1.0...v0.1.1) (2025-10-17)


### Bug Fixes

* **ci:** set permissions ([4ab51bc](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/4ab51bc5ae4ec794665e7fb69aefc1283c7822a1))
* missing extension icon ([ce6919e](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/ce6919e1e8e6d2236ce64f51cd889bb45d1c8fd4))
* **package:** wrong repository uri ([8f16364](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/8f16364b833368d3613cdc0ae0efc8f0ef98ca59))

## [0.1.0](https://github.com/tristantheb-Production/mdn-macros-syntax/compare/v0.0.1...v0.1.0) (2025-10-17)


### Features

* **core:** adding core content ([e1b4066](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/e1b406660eb2280cc4a29d08c6f25376b51fe8be))
* implement macro loader ([2639681](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/26396818f1f84c9b0f3c41b1377b455612b32692))
* **qfix:** implement Quick Fix option ([6d42fa9](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/6d42fa9b99b647faab21076dea524f4bff447c48))
* **tests:** adding test elements ([ec41ea6](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/ec41ea683d04b6c74ea5b1dbf95ca5e6e3c8c49e))


### Bug Fixes

* missing type on maxro index ([a3f0079](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/a3f0079de5e89a7e93fd071d3ae97c8bd83edd51))


### Miscellaneous

* add injection file ([fdd47b5](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/fdd47b5b4a6df4b4dc6082e6d612f2453317e09b))
* adding deprecation warning example ([5ea96f6](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/5ea96f662b1625d4b0bae24ba2f7e11c4b9d09ac))
* adding license file ([e387532](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/e387532d4a0738d7877539bf857287b8a637e8b3))
* **core:** clean code ([ec58637](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/ec586376c2ea734d5087c6565c6bb287cca6e66f))
* **deps:** change eslint config ([f2fc6f8](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/f2fc6f8ae0eefcbea34fad20f76425b629ac695b))
* initial commit ([ef55261](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/ef5526132d349179a442e2b1f5d06d440aba16ce))
* lint files ([eeaca50](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/eeaca5040195be9862f0d43030e699bd6cae5862))
* **macros:** add lowercased macros to normal case ([6d38a59](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/6d38a59f42d2e27b60d64548c152437e1bb122ed))
* **macros:** adding A-H macros ([a5a0157](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/a5a0157954d984b4568b220de23be51d59a2f2f3))
* **macros:** adding I-X macros ([baada43](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/baada4363a209eef6d37b63fa5227be953d722aa))
* **macros:** adding macros descriptions ([2a4bdaf](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/2a4bdafa59084c36ee99312c54d195577cfb94fe))
* **ressources:** implement plugin ressources ([d8b484a](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/d8b484ad0e8e19c09937f3e317a15bad7a4475bd))
* updating docs elements ([8a773c4](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/8a773c4a102f4a89990b5b74fb342d46ab4d3d1f))
* **utils:** adding utils tools ([6e1b425](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/6e1b425f87729a2719f72d9f65a9da4e0f3f2106))
* **version:** set initial version ([771e331](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/771e331f335d4bb4e90fd4b7a1269d606cfaf397))


### CI/CD changes

* adding pr please and change validation methods ([4e2ebbb](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/4e2ebbb4f9306ccdbcc8aa767698e6a5cfd91439))
* implement codeql ([c158853](https://github.com/tristantheb-Production/mdn-macros-syntax/commit/c1588531fc4b20cb0c30a7e5072ff658852b32c6))
