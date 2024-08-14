const { test } = require("node:test");
const assert = require("node:assert");

const reverse = require("../utils/for_testing").reverse;

test("Reverse of a", () => {
  const result = reverse("a");
  assert.strictEqual(result, "a");
});

test("Reverse of react", () => {
  const result = reverse("react");
  assert.strictEqual(result, "tcaer");
});

test("reverse of saippuakauppias", () => {
  const result = reverse("saippuakauppias");
  assert.strictEqual(result, "saippuakauppias");
});
