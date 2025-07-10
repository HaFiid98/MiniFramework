import { eventManager } from "./events.js";

export function createElement(tag, attrs , ...childs) {
  const flatchilds = childs.flat(Infinity)

  const checkedchilds = flatchilds.filter(
    child => child != null && child !== false
  );

  return {
    tag,
    attrs: attrs || {},
    children: checkedchilds
  };
}


export function render(vdom, container) {
  // console.log("rendering")
  while (typeof vdom === 'function') {
    vdom = vdom();
  }

  if (typeof vdom === 'string' || typeof vdom === 'number') {
    // console.log(vdom,container)//////////hnaaaaaaaaaaaaaaaaaaaaaaaa
    container.appendChild(document.createTextNode(vdom));
    return;
  }
  if (!vdom) {
    return;
  }
  const Rele = document.createElement(vdom.tag);
  // console.log("rele",Rele);
  for (const [k, val] of Object.entries(vdom.attrs || {})) {
    if (k.startsWith('on') && typeof val === 'function') {
      const eventName = k.substring(2).toLowerCase();
      eventManager.addevent(eventName,Rele.tagName,val)
    } else if (k === 'className') {
      Rele.className = val;
    } else if (k === 'style' && typeof val === 'object') {
      Object.assign(Rele.style, val);
    } else {
      Rele.setAttribute(k, val);
    }
  }

  const children = Array.isArray(vdom.children) ? vdom.children : [vdom.children];
  // console.log("children")
  children.forEach(child => {
    if (child !== undefined && child !== null && child !== false) {
      render(child, Rele);
    }
  });
  // console.log("reeelejkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj " , Rele);
  if (container != null) container.appendChild(Rele);
  return Rele;
}

export function diff(old, newD) {
  console.log("old",old);
  console.log("newD",newD);
  if (!old) 
    return { node: newD };
  if (!newD) 
    return { node: null };
  if (typeof old === 'string' || typeof newD === 'string') {
    if (old !== newD) {
      return { node: newD };
    }
    // console.log("old and new are same string");
    return { node: old };
  }
  
  if (old.tag !== newD.tag) {
    return { node: newD };
  }
  if (typeof newD === "function") {
    return {node:newD}
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
  // console.log("childPatches")
  return {
    node: newD,
    attrPatches,
    childPatches
  };
}

let track = -1;
export function patch(parent, patches, index = 0) {
  if (!patches.node) {
    parent.removeChild(parent.childNodes[index]);
    return 1;
  }
  if (!parent.childNodes[index]) {
    // console.log(patches.node,patches)
    parent.appendChild(render(patches.node,null));
    return 0;
  }
  if (patches.attrPatches) {
    const element = parent.childNodes[index];
    for (const [k, val] of Object.entries(patches.attrPatches)) {
      if (k.startsWith('on') && typeof val === 'function') {
        eventManager.addevent(k.substring(2).toLocaleLowerCase(),element.tagName,val);
      } else if (val === null || val === undefined) {
        element.removeAttribute(k);
      } else {
        element.setAttribute(k, val);
      }
    }
  }


  if (patches.childPatches) {
    const childNode = parent.childNodes[index];
    let j = 0;
    for (let i = 0; i < patches.childPatches.length; i++) {
      track = patch(childNode, patches.childPatches[i], j);
      if (track == 1) {
        j--;
        track = -1;
      }
      j++;
    }
  }
  if ((typeof patches.node === 'string' || typeof patches.node === 'number') && parent.childNodes[index].textContent != patches.node) {
    parent.childNodes[index].textContent = patches.node
  }
  return 3;
}