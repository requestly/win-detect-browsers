// https://github.com/vweevers/win-version-info/issues/17

const { exec } = require("child_process");
const debug = require("debug")("win-version-info");

module.exports = function annotate(b) {
  var path = b.path;

  try {
    const result = await exec(
      `wmic datafile where "name='${path
        .split("\\")
        .join("\\\\")}'" get version`
    );

    const parts = result.split("\n")[1].split(".");
    if (parts.length === 0) {
      throw new Error("Unknown version string");
    }

    const buildNumber = parseInt(parts[parts.length - 1]);
    if (buildNumber === undefined) {
      throw new Error("can't parse the build number");
    }
  } catch (err) {
    debug("%s: win-version-info failed for %s", b.name, b.path, err);
    return;
  }

  const version = buildNumber;

  b.version = version;
  // Hard code for now. Todo @sagar
  b.info = {
    FileVersion: version,
    LegalCopyright: "© Browser",
    CompanyName: "Browser Company",
    FileDescription: "Found Browser",
    ProductVersion: version,
    InternalName: "Browser",
    LegalTrademarks: "Browser",
    OriginalFilename: "browser.exe",
    ProductName: "Browser",
    BuildID: version,
  };

  return b;
};
