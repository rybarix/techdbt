import util from "node:util";

export class Fmt {
  /**
   * @param {import("./scanner").FileScan[]} scanOutput
   */
  static toStdout(scanOutput) {
    return scanOutput
      .flatMap((so) =>
        so.findings.map((fi) =>
          util.format(
            "\x1b[36m%s\x1b[0m:%s \x1b[90m%s\x1b[0m",
            so.file,
            fi.line,
            fi.comment
          )
        )
      )
      .join("\n");
  }

  /**
   * @param {import("./scanner").FileScan[]} scanOutput
   */
  static toString(scanOutput) {
    return scanOutput
      .flatMap((so) =>
        so.findings.map((fi) => `${so.file}:${fi.line} ${fi.comment}`)
      )
      .join("\n");
  }

  /**
   * @param {import("./scanner").FileScan[]} scanOutput
   */
  static toJSON(scanOutput) {
    let buf = [];
    for (const so of scanOutput) {
      for (const fi of so.findings) {
        buf.push({ file: so.file, line: fi.line, comment: fi.comment });
      }
    }

    return JSON.stringify(buf);
  }

  /**
   * @param {import("./scanner").FileScan[]} scanOutput
   */
  static toJSONL(scanOutput) {
    return scanOutput
      .flatMap((so) =>
        so.findings.map((fi) =>
          JSON.stringify({
            file: so.file,
            line: fi.line,
            comment: fi.comment,
          })
        )
      )
      .join("\n");
  }
}
