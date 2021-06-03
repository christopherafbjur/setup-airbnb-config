import arg from 'arg';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createProject } from './main';
import { detectPackageManager } from './utils/helpers';
import { packageJsonExists } from './utils/helpers';

function parseArgsIntoOptions(rawArgs, options) {
  let args;
  try {
    args = arg(
      {
        '--yarn': Boolean,
        '--npm': Boolean,
        '--react': Boolean,
        '--javascript': Boolean,
        '--help': Boolean,
        '-j': '--javascript',
        '-r': '--react',
        '-h': '--help',
      },
      {
        argv: rawArgs.slice(2),
      }
    );
  } catch (err) {
    console.error('%s '.concat(err.message), chalk.red.bold('ERROR '));
    process.exit(1);
  }

  return {
    ...options,
    displayHelp: args['--help'] || false,
    template: (function () {
      if (args['--react']) return 'react';
      if (args['--javascript']) return 'javascript';

      return null;
    })(),
    manager: (function () {
      if (args['--npm']) return 'npm';
      if (args['--yarn']) return 'yarn';

      return null;
    })(),
  };
}

function createOptions() {
  console.log(process.cwd());
  return {
    targetDirectory: process.cwd(),
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'javascript';
  const defaultManager = 'npm';

  const questions = [];

  if (!options.manager) {
    detectPackageManager(options, ({ detected, error }) => {
      if (detected) {
        options.manager = detected;
      } else {
        questions.push({
          type: 'list',
          name: 'manager',
          choices: ['npm', 'yarn'],
          message: error,
          default: defaultManager,
        });
      }
    });
  }

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose what type of project this is',
      choices: [
        { name: 'JavaScript', value: 'javascript' },
        { name: 'React', value: 'react' },
      ],
      default: defaultTemplate,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    manager: options.manager || answers.manager,
  };
}

export async function cli(args) {
  let options = createOptions();

  options = parseArgsIntoOptions(args, options);

  if (options.displayHelp) {
    const help = `
      Options
        -j, --javascript    Generates a JS configuration
        -r, --react         Generates a React configuration
        --yarn              Enforce npm to be used when installing dependencies
        --npm               Enforce yarn to be used when installing dependencies

      Examples
        $ setup-airbnb-config --r --yarn
        $ setup-airbnb-config --javascript --npm
        $ setup-airbnb-config
`;
    console.log(help);
    process.exit(1);
  }

  if (!packageJsonExists(options)) {
    console.error('%s Missing package.json.', chalk.red.bold('ERROR '));
    process.exit(1);
  }

  options = await promptForMissingOptions(options);

  await createProject(options);
}
