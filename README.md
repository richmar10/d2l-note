# d2l-note
[![Build status][ci-image]][ci-url]

A Note

## Viewing Your Element

```bash
npm run start
```
## Running Tests

```bash
npm run test
```

## Versioning

Commits and PR merges to master will automatically do a minor version bump which will:
* Update the version in `package.json`
* Add a tag matching the new version
* Create a github release matching the new version

By using either **[increment major]** or **[increment patch]** notation inside your merge message, you can overwrite the default version upgrade of minor to the position of your choice.

## Localization

This repo uses [Serge](https://docs.dev.d2l/index.php/Serge-Localize) for localization. On any changes to langterm data files (eg. due to adding new lang terms, or merging an automated PR that provides updated translations), you must run
```bash
npm run localize
```
to generate new modules with the updated data.


[ci-url]: https://travis-ci.com/Brightspace/d2l-note
[ci-image]: https://travis-ci.com/Brightspace/d2l-note.svg?token=zuyCdqqy8sVToprVBgAu&branch=master
