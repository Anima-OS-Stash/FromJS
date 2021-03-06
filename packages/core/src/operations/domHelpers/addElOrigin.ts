import { consoleLog } from "../../helperFunctions/logging";

export default function addElOrigin(el, what, origin) {
  const {
    action,
    value,
    inputValuesCharacterIndex,
    extraCharsAdded,
    offsetAtCharIndex,
    error,
    child,
    children,
    trackingValue // aka inputValue
  } = origin;

  if (!el) {
    debugger;
  }

  if (!el.__elOrigin) {
    el.__elOrigin = {};
  }

  if (what === "replaceContents") {
    el.__elOrigin.contents = children;
  } else if (what === "appendChild") {
    if (!el.__elOrigin.contents) {
      el.__elOrigin.contents = [];
    }
    el.__elOrigin.contents.push(child);
  } else if (what === "prependChild") {
    if (!el.__elOrigin.contents) {
      el.__elOrigin.contents = [];
    }

    el.__elOrigin.contents.push(child);
  } else if (what === "prependChildren") {
    children.forEach(child => {
      addElOrigin(el, "prependChild", { child });
    });
  } else {
    if (!("trackingValue" in origin)) {
      consoleLog("no tracking value in addelorigin");
    }
    el.__elOrigin[what] = {
      action,
      trackingValue,
      inputValuesCharacterIndex: inputValuesCharacterIndex || [0],
      extraCharsAdded: extraCharsAdded || 0,
      offsetAtCharIndex
    };
  }
}

export function addOriginInfoToCreatedElement(
  el,
  tagNameTrackingValue,
  action
) {
  if (typeof tagNameTrackingValue !== "number") {
    debugger;
    throw Error("tag name tracking value should be number");
  }
  const origin = {
    trackingValue: tagNameTrackingValue,
    value: el.tagName,
    action
  };
  addElOrigin(el, "openingTagStart", origin);
  addElOrigin(el, "openingTagEnd", origin);
  addElOrigin(el, "closingTag", origin);
}

export function addElAttributeNameOrigin(el, attrName, origin) {
  addElOrigin(el, "attribute_" + attrName + "_name", origin);
}
export function addElAttributeValueOrigin(el, attrName, origin) {
  addElOrigin(el, "attribute_" + attrName + "_value", origin);
}

export function getElAttributeNameOrigin(el, attrName) {
  return el.__elOrigin["attribute_" + attrName + "_name"];
}
export function getElAttributeValueOrigin(el, attrName) {
  return el.__elOrigin["attribute_" + attrName + "_value"];
}
