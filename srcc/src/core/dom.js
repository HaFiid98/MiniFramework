class VDom {
  constructor(tag, attrs = {}, children = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  }
}


//building virtueldomm
export function createElement(tag, attrs, ...childs) {
  const flatcilds = childs.reduce((acc, child) => {
    if (Array.isArray(child)) {
      return [...acc, ...child];
    }
    return [...acc, child];
  }, []);

  // const checkedchilds = flatcilds.filter(
  //   child => child != null && child !== false
  // );

  return {
    tag,
    attrs: attrs || {},
    children: flatcilds
  };
}


//Turns a virtual node into a real DOM node and appends it.
export function render(vdom, container) {
  // if a component func
  if (typeof vdom === 'function') {
    vdom = vdom();
  }

  // if a string
  // if (typeof vdom === 'string' || typeof vdom === 'number') {
  //   container.appendChild(document.createTextNode(vdom));
  //   return;
  // }

  if (!vdom) {
    return;
  }

  // Create real DOM element
  const Rele = document.createElement(vdom.tag);

  // Set attributes
  for (const [k, val] of Object.entries(vdom.attrs || {})) {
    if (k.startsWith('on') && typeof val === 'function') {
      const eventName = k.substring(2).toLowerCase();
      Rele.addEventListener(eventName, val);
      // on(eventName,vdom.tag,val)
    } else if (k === 'className') {
      Rele.className = val;
    } else if (k === 'style' && typeof val === 'object') {
      Object.assign(Rele.style, val);
    } else {
      Rele.setAttribute(k, val);
    }
  }

  // Handle children (ensure we always work with an array)
  const children = Array.isArray(vdom.children) ? vdom.children : [vdom.children];
  
  // Recursively render children
  children.forEach(child => {
    if (child !== undefined && child !== null && child !== false) {
      render(child, Rele);
    }
  });

  // Append to parent
  container.appendChild(Rele);
}



export function diff(old, newD) {
  if (!old) return { node: newD };
  if (!newD) return { node: null };
  
  if (typeof old === 'string' || typeof newD === 'string') {
    if (old !== newD) {
      return { node: newD };
    }
    return { node: null };
  }

  if (old.tag !== newD.tag) {
    return { node: newD };
  }

  // Diff attrs
  const attrPatches = {};
  const allAttrs = new Set([...Object.keys(old.attrs), ...Object.keys(newD.attrs)]);
  
  for (const key of allAttrs) {
    if (old.attrs[key] !== newD.attrs[key]) {
      attrPatches[key] = newD.attrs[key];
    }
  }

  // diffing children
  const childPatches = [];
  const len = Math.max(old.children.length, newD.children.length);
  
  for (let i = 0; i < len; i++) {
    childPatches.push(diff(old.children[i], newD.children[i]));
  }

  return {
    node: newD,
    attrPatches,
    childPatches
  };
}


//append changes patches to the dom
/*Adds/removes elements

Updates attributes

Recursively patches children
*/
export function patch(parent, patches, index = 0) {
  if (!patches.node) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }

  if (!parent.childNodes[index]) {
    parent.appendChild(render(patches.node));
    return;
  }

  if (patches.attrPatches) {
    const el = parent.childNodes[index];
    for (const [key, value] of Object.entries(patches.attrPatches)) {
      if (key.startsWith('on') && typeof value === 'function') {
        el.removeEventListener(key.substring(2).toLowerCase(), el[key]);
        el.addEventListener(key.substring(2).toLowerCase(), value);
        el[key] = value;
      } else if (value === null || value === undefined) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  if (patches.childPatches) {
    const childNode = parent.childNodes[index];
    for (let i = 0; i < patches.childPatches.length; i++) {
      patch(childNode, patches.childPatches[i], i);
    }
  }
}