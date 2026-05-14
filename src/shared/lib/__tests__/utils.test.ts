import { describe, it } from "node:test";
import assert from "node:assert";
import { cn } from "../utils.ts";

describe("cn", () => {
  it("should merge tailwind classes properly", () => {
    assert.strictEqual(cn("p-2", "p-4"), "p-4");
    assert.strictEqual(cn("text-red-500", "text-blue-500"), "text-blue-500");
    assert.strictEqual(cn("bg-red-500 py-2", "bg-blue-500 p-4"), "bg-blue-500 p-4");
  });

  it("should handle conditional classes", () => {
    assert.strictEqual(cn("p-2", true && "text-red-500", false && "bg-blue-500"), "p-2 text-red-500");
    assert.strictEqual(cn("p-2", null, undefined, false, 0, "", "text-red-500"), "p-2 text-red-500");
  });

  it("should handle arrays of classes", () => {
    assert.strictEqual(cn(["p-2", "text-red-500"]), "p-2 text-red-500");
    assert.strictEqual(cn(["p-2", "p-4"], ["text-red-500"]), "p-4 text-red-500");
  });

  it("should handle object syntax", () => {
    assert.strictEqual(cn({ "p-2": true, "p-4": false }), "p-2");
    assert.strictEqual(cn("text-red-500", { "text-blue-500": true }), "text-blue-500");
  });

  it("should handle a mix of inputs", () => {
    assert.strictEqual(
      cn(
        "p-2",
        ["text-red-500", "bg-white"],
        { "font-bold": true, "underline": false },
        "p-4"
      ),
      "text-red-500 bg-white font-bold p-4"
    );
  });
});
