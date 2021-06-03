# setup-airbnb-config

Bootstraps your [VSCode](https://code.visualstudio.com/) project with [Airbnb's eslint configuration](https://www.npmjs.com/package/eslint-config-airbnb) together with [Prettier](https://prettier.io/) through a CLI.

This CLI will will try to automatically detect wether you're using `yarn` or `npm` in your project before installing the dependencies and Airbnb peer dependencies. It will also create a `.vscode/settings.json` file and enable `formatOnSave` which is useful for overriding your global settings for this local project. If this file already exist in your project, the setting will be added to it.

## Installation

1. Install [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions in VSCode.
2. Now simply run the CLI followed by the project path to bootstrap:

```bash
  npx setup-airbnb-config .
```

3. Select the desired project type (Javascript or React).

## Usage

```bash
npx setup-airbnb-config <path> [--options]
```

### Options

| Flag               | Description                                           |
| :----------------- | :---------------------------------------------------- |
| `-j, --javascript` | Generates a JS configuration.                         |
| `-r, --react`      | Generates a React configuration.                      |
| `--npm`            | Enforce npm to be used when installing dependencies.  |
| `--yarn`           | Enforce yarn to be used when installing dependencies. |

### Examples

```bash
npx setup-airbnb-config ./myProject --r --yarn
```

Creates a react configuration and enforce yarn to be used when installing dependencies.

```bash
npx setup-airbnb-config . --javascript --npm
```

Creates a vanilla JS configuration and enforce npm to be used when installing dependencies.

```
npx setup-airbnb-config ~/myProject
```

Runs the CLI and asks you the required questions such as project type and preferred package manager if automatic detection fails.

## FAQ

#### I'm seeing an error "Missing package.json"

Your project needs at least a package.json at the same level as `npx setup-airbnb-config` is run in order to install the required dependencies.

#### What package manager is used for installing required dependencies?

The CLI will try to automatically detect which package manager you're using. If it cannot be determined, the CLI will ask you which package manager you want to use.

## Contributing

Contributions are always welcome!

File an issue or create a pull request if you find something that can be enhanced.

## Related

- ESLint Rules - https://eslint.org/docs/rules/
- Prettier Options - https://prettier.io/docs/en/options.html
- Airbnb Style Guide - https://github.com/airbnb/javascript

## License

[![MIT License](https://img.shields.io/github/license/christopherafbjur/setup-airbnb-config)](https://github.com/christopherafbjur/setup-airbnb-config/blob/main/LICENSE)
