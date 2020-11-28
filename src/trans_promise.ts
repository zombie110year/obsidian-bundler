import {
  copyFile as fs_copyFile,
  MakeDirectoryOptions,
  mkdir as fs_mkdir,
  PathLike,
} from "fs";

/**
 * Copy `src` to `dest`
 */
export function copyfile(src: PathLike, dest: PathLike): Promise<void> {
  return new Promise(function (resolve, reject) {
    fs_copyFile(src, dest, function () {
      resolve();
    });
  });
}

/**
 * Create Directory, if `options.recursive` is `true`, it will return the **first** directory created.
 */
export function mkdir(
  path: PathLike,
  options: MakeDirectoryOptions = { recursive: true, mode: 0o777 }
): Promise<string | undefined> {
  return new Promise(function (resolve, reject) {
    fs_mkdir(path, options, function (err, path) {
      if (err) {
        reject(err);
      } else {
        resolve(path);
      }
    });
  });
}
