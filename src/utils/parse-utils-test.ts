import { assert } from "chai";
import * as utils from "./parse-utils";
import { fail } from "assert";

describe("Parse utils unit-test", () => {
  it("Should parse number", async () => {
    assert.equal(utils.parseToNumberOrThrow("5"), 5);
  });

  it("Should fail parse number", async () => {
    try {
      utils.parseToNumberOrThrow("sdaafds");
      fail("Should have failed parsing");
    } catch (ex) {
      assert.equal(ex.message, '"sdaafds" is not a valid number.');
    }
  });

  it("Should parse date", async () => {
    assert.equal(utils.parseDate("5/5/2024"), 1714863600000);
  });

  it("Should fail parse number", async () => {
    try {
      utils.parseDate("sdaafds");
      fail("Should have failed parsing");
    } catch (ex) {
      assert.equal(ex.message, '"sdaafds" is not a valid date in format dd/mm/yyyy.');
    }
  });
});
