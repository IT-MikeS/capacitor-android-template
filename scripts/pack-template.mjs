import { join } from 'path';
import { mkdir, access } from 'fs/promises';
import { constants } from 'fs';
import * as cp from 'child_process';
import * as util from 'util';
import tar from 'tar';

const cp_exec_promise = util.promisify(cp.exec);

((async () => {
  try {
    await access('./dist', constants.F_OK);
  } catch(e) {
    await mkdir('./dist');
  }
  const dest = join('./dist', 'android-template.tar.gz');
  const templatePath = join('./src');

  const files = (
    await cp_exec_promise(`git ls-files "${templatePath}"`, { cwd: templatePath })
  ).stdout.trim().split('\n');

  await tar.create({ gzip: true, file: dest, cwd: templatePath }, files);

  console.log(`Packed ${dest}!`);
})()).catch(e => {
  process.stderr.write(e.stack ?? e);
  process.exit(1);
});;