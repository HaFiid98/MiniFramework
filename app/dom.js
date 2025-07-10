// vdom.js

import { addevent, delevent } from "./events.js";

// ✅ 1. createElement with key support
export function createElement(tag, attrs, ...childs) {
  const flatchilds = childs.flat(Infinity);
  const checkedchilds = flatchilds.filter(
    child => child != null && child !== false
  );

  return {
    tag,
    attrs: attrs || {},
    key: attrs?.key ?? null, // ✅ Store key
    children: checkedchilds
  };
}

// ✅ 2. render virtual DOM into real DOM
export function render(vdom, container) {
  while (typeof vdom === 'function') {
    vdom = vdom();
  }

  if (typeof vdom === 'string' || typeof vdom === 'number') {
    container.appendChild(document.createTextNode(vdom));
    return;
  }

  if (!vdom) return;

  const Rele = document.createElement(vdom.tag);

  for (const [k, val] of Object.entries(vdom.attrs || {})) {
    if (k.startsWith('on') && typeof val === 'function') {
      const eventName = k.substring(2).toLowerCase();
      addevent(eventName, Rele.tagName, val);
    } else if (k === 'className') {
      Rele.className = val;
    } else if (k === 'style' && typeof val === 'object') {
      Object.assign(Rele.style, val);
    } else {
      if (k === 'checked') Rele.checked = !!val;
      else Rele.setAttribute(k, val);
    }
  }

  // ✅ Set data-key if key exists
  if (vdom.key != null) {
    Rele.setAttribute("data-key", vdom.key);
  }

  const children = Array.isArray(vdom.children) ? vdom.children : [vdom.children];
  children.forEach(child => {
    if (child !== undefined && child !== null && child !== false) {
      render(child, Rele);
    }
  });

  container.appendChild(Rele);
}

// ✅ 3. diff with key-based child matching
export function diff(old, newD) {
  if (newD === undefined) return null;
  if (!old) return { node: newD };

  if ((typeof old === 'string' || typeof old === 'number') &&
      (typeof newD === 'string' || typeof newD === 'number')) {
    return old !== newD ? { node: newD } : { node: null };
  }

  if (old.tag !== newD.tag) return { node: newD };

  const attrPatches = {};
  const allAttrs = new Set([...Object.keys(old.attrs), ...Object.keys(newD.attrs)]);
  for (const key of allAttrs) {
    if (old.attrs[key] !== newD.attrs[key]) {
      attrPatches[key] = newD.attrs[key];
    }
  }

  // ✅ Key-aware diffing
  const oldChildren = old.children || [];
  const newChildren = newD.children || [];
  const childPatches = [];
  const keyed = !!newChildren.some(c => c?.key != null);

  if (keyed) {
    const oldMap = {};
    oldChildren.forEach((child, i) => {
      const key = child?.key ?? i;
      oldMap[key] = child;
    });

    newChildren.forEach((child, i) => {
      const key = child?.key ?? i;
      const oldMatch = oldMap[key];
      childPatches.push(diff(oldMatch, child));
    });

    return {
      node: newD,
      attrPatches,
      childPatches,
      keyed: true,
      keys: newChildren.map(c => c?.key ?? null)
    };
  } else {
    const len = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < len; i++) {
      childPatches.push(diff(oldChildren[i], newChildren[i]));
    }

    return {
      node: newD,
      attrPatches,
      childPatches,
      keyed: false
    };
  }
}

// ✅ 4. patch with key-based mapping and checkbox handling
export function patch(parent, patches, index = 0) {
  if (!patches) {
    if (parent.childNodes[index]) {
      parent.removeChild(parent.childNodes[index]);
    }
    return;
  }

  if (parent.childNodes[index] === undefined) {
    render(patches.node, parent);
    return;
  }

  const element = parent.childNodes[index];

  if (patches.attrPatches) {
    for (const [k, val] of Object.entries(patches.attrPatches)) {
      if (k.startsWith('on') && typeof val === 'function') {
        delevent(k.substring(2).toLowerCase(), element.tagName, val);
        addevent(k.substring(2).toLowerCase(), element.tagName, val);
      } else if (k === 'checked') {
        element.checked = !!val; // ✅ Proper checkbox control
      } else if (val === null || val === undefined) {
        element.removeAttribute(k);
      } else {
        element.setAttribute(k, val);
      }
    }
  }

  if (patches.childPatches) {
    const childNode = parent.childNodes[index];

    if (patches.keyed) {
      const existingMap = {};
      for (let i = 0; i < childNode.childNodes.length; i++) {
        const node = childNode.childNodes[i];
        const key = node?.getAttribute?.('data-key') ?? i;
        existingMap[key] = node;
      }

      patches.keys.forEach((key, i) => {
        const patchData = patches.childPatches[i];
        const existing = existingMap[key];

        if (existing && childNode.childNodes[i] !== existing) {
          childNode.insertBefore(existing, childNode.childNodes[i]);
        }

        patch(childNode, patchData, i);
      });

      // Remove extra nodes
      while (childNode.childNodes.length > patches.keys.length) {
        childNode.removeChild(childNode.lastChild);
      }
    } else {
      for (let i = 0; i < patches.childPatches.length; i++) {
        patch(childNode, patches.childPatches[i], i);
      }
    }
  }

  if (typeof patches.node === 'string' || typeof patches.node === 'number') {
    parent.childNodes[index].textContent = patches.node;
  }
}
