import fs from "node:fs/promises";
import path from "node:path";

/**
 * @typedef {{ line:number, after: string, comment: string }} LineContext
 * @typedef {{ file: string, findings: LineContext[] }} FileScan
 */

export class Scanner {
  /**
   * @type {string}
   */
  #file;
  /**
   * @type {string[]} array of RegExp strings
   */
  #patterns;

  /**
   * @param {string} file
   * @param {string[]} patterns RegExp patterns to catch
   */
  constructor(
    file,
    patterns = ["FIXME:s?(.*)", "REFACTOR:s?(.*)", "TODO:s?(.*)"]
  ) {
    this.#file = file;
    this.#patterns = patterns;
    this.nextNLines = this.nextNLines.bind(this);
    this.regexLineCtx = this.regexLineCtx.bind(this);
  }

  /**
   *
   * @param {string} input
   * @param {number} index
   * @param {number} n
   */
  nextNLines(input, index, n) {
    if (n <= 0 && input.length - 1 < index) {
      throw new Error("invalid argument n, must be positive int");
    }

    let end = input.length - 1;
    for (let i = index; i < input.length; i++) {
      if (input[i] === "\n" && --n <= 0) {
        end = i;
        break;
      }
    }

    return input.substring(index, end);
  }

  /**
   *
   * @param {RegExpExecArray} regexec
   * @return {LineContext}
   */
  regexLineCtx(regexec) {
    const { index, input } = regexec;
    const output = { line: 1, after: "", comment: "" };

    let lastNewLine = input.length - 1;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === "\n") {
        lastNewLine = i;
        output.line++;
      }
      if (i > index) {
        output.comment = regexec[0];
        output.after = this.nextNLines(input, lastNewLine, 5);
        return output;
      }
    }
    return output;
  }

  /**
   *
   * @param {string} file
   * @returns {Promise<FileScan>}
   */
  async scan() {
    // patterns to scan
    const rALL = new RegExp(this.#patterns.join("|"), "gm");
    const source = await fs.readFile(this.#file, "utf-8");
    const mALL = source.matchAll(rALL);

    return {
      file: this.#file,
      findings: Array.from(mALL).map(this.regexLineCtx),
    };
  }
}

export class FileTreeScanner {
  /**
   * @type {string} starting directory to scan from
   */
  #start;

  /**
   * @param {string} startDir
   */
  constructor(startDir) {
    this.#start = startDir;
  }

  /**
   * @returns {Promise<FileScan[]>}
   */
  async scan() {
    // FIXME: replace with function that respects .gitignore file
    let files = await fs.readdir(this.#start, {
      recursive: true,
      withFileTypes: true,
    });
    files = files
      .filter((f) => f.isFile())
      .map((f) => path.join(f.path, f.name));

    return await Promise.all(
      files.map(async (f) => {
        const scanner = new Scanner(f);
        return await scanner.scan();
      })
    );
  }
}
