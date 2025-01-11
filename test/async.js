"use strict";
const assert = require("node:assert");
const test = require("./test");
const { async } = require("../main");
const fs = require("node:fs");

const promisify = async () => {
  const readAsync = async.promisify(fs.readFile);
  const text = await readAsync(__filename, "utf-8");
  const buffer = await readAsync(__filename);
  if (typeof text !== "string") assert.fail("No content");
  if (!Buffer.isBuffer(buffer)) assert.fail("No buffer");
};

const compose = async () => {
  const promiseFn = async.promisify(fs.readFile);
  const toUpperFile = async.compose(promiseFn, data => data.toUpperCase());
  const first30 = async.compose(promiseFn, data => data.toString(), s => s.substring(0, 30));
  const text = await toUpperFile(__filename, "utf-8");
  const cut = await first30(__filename);
  if (typeof text !== "string") assert.fail("No content");
  assert.equal(cut.length, 30);
};

const thenable = async () => {
  const content = await async.thenable(fs.readFile, __filename, "utf-8");
  if (typeof content !== "string") assert.fail("No content");
};

test.async([promisify, compose, thenable], "async");