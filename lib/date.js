'use strict';
const number = require("./number");

const ERRORS = {
  verbalFormat: new Error("Wrong verbal format, available only '1d 2h 3m 4s' pattern"),
  dateFormat: new Error("Wrong date format"),
};

const INTERVALS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 60 * 60 * 24 * 1000,
};

Object.freeze(INTERVALS);

const verbal = (input) => {
  let time = 0;
  if(typeof input !== "string") return time;
  const parts = input.trim().split(" ");
  for (const part of parts) {
    const multiplier = part.replace(/\D$/, "");
    const key = part.replace(multiplier, "");
    const base = INTERVALS[key];
    if (!base) throw ERRORS.verbalFormat;
    time += (base * number.safe(multiplier));
  }
  return time;
};

const unix = (input) => {
  const date = new Date(input);
  if (isNaN(Date.parse(date))) throw ERRORS.dateFormat;
  return Math.floor(date.getTime() / INTERVALS.s);
};

const difference = (target, base = Date.now()) => new Date(target).getTime() - new Date(base).getTime();

const reached = (target, base = Date.now()) => new Date(target).getTime() >= new Date(base).getTime();

const verbalEpoch = (input) => {
  const time = verbal(input);
  return Date.now() + time;
};

const midnightUTC = (input) => {
  const date = new Date(input);
  if (isNaN(Date.parse(date))) throw ERRORS.dateFormat;
  return date.setUTCHours(0, 0, 0, 0);
};

const midnight = (input) => {
  const date = new Date(input);
  if (isNaN(Date.parse(date))) throw ERRORS.dateFormat;
  return date.setHours(0, 0, 0, 0);
};

module.exports = {
  verbalEpoch,
  verbal,
  unix,
  difference,
  midnightUTC,
  midnight,
  reached,
  DAY: INTERVALS.d,
  HOUR: INTERVALS.h,
  MINUTE: INTERVALS.m,
  SECOND: INTERVALS.s,
};