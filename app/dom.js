
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


export function render(vdom, container) {
  if (typeof vdom === 'function') {
    vdom = vdom();
  }

  if (typeof vdom === 'string' || typeof vdom === 'number') {
    container.appendChild(document.createTextNode(vdom));
    return;
  }

  if (!vdom) {
    return;
  }
  // console.log(vdom)

  const Rele = document.createElement(vdom.tag);
  // console.log(Rele)
  for (const [k, val] of Object.entries(vdom.attrs || {})) {
    if (k.startsWith('on') && typeof val === 'function') {
      const eventName = k.substring(2).toLowerCase();
      Rele.addEventListener(eventName, val);
    } else if (k === 'className') {
      Rele.className = val;
    } else if (k === 'style' && typeof val === 'object') {
      Object.assign(Rele.style, val);
    } else {
      Rele.setAttribute(k, val);
    }
  }

  const children = Array.isArray(vdom.children) ? vdom.children : [vdom.children];
  
  children.forEach(child => {
    if (child !== undefined && child !== null && child !== false) {
      render(child, Rele);
    }
  });

  container.appendChild(Rele);
}



export function diff(old, newD) {
  if (!old) 
    return { node: newD };
  if (!newD) 
    return { node: null };
  
  if (typeof old === 'string' || typeof newD === 'string') {
    if (old !== newD) {
      return { node: newD };
    }
    return { node: null };
  }

  if (old.tag !== newD.tag) {
    return { node: newD };
  }

  const attrPatches = {};
  const allAttrs = new Set([...Object.keys(old.attrs), ...Object.keys(newD.attrs)]);
  
  for (const key of allAttrs) {
    if (old.attrs[key] !== newD.attrs[key]) {
      attrPatches[key] = newD.attrs[key];
    }
  }

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
    const element = parent.childNodes[index];
    for (const [k, val] of Object.entries(patches.attrPatches)) {
      if (k.startsWith('on') && typeof val === 'function') {
        element.removeEventListener(k.substring(2).toLowerCase(), element[k]);
        element.addEventListener(k.substring(2).toLowerCase(), val);
        element[k] = val;
      } else if (val === null || val === undefined) {
        element.removeAttribute(k);
      } else {
        element.setAttribute(k, val);
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