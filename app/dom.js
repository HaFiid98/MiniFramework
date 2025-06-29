

export function createElement(tag, attrs, ...childs) {
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
    
  while (typeof vdom === 'function') {
    vdom = vdom();
  }

  if (typeof vdom === 'string' || typeof vdom === 'number') {
    container.appendChild(document.createTextNode(vdom));
    return;
  }

  if (!vdom) {
    return;
  }
  const Rele = document.createElement(vdom.tag);
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
  // console.log("reeele " , Rele);
  
  container.appendChild(Rele);
}

export function diff(old, newD) {
  console.log("1")
  if (newD == undefined) {
    return null;
  }
  if (!old) {
   return { node: newD };
  }

  console.log("beeeeekhdshkf" , newD);
  
  if ((typeof old === 'string' && typeof newD === 'string') || (typeof old === 'number' && typeof newD === 'number')  ) {
    if (old !== newD) {
      return { node: newD };
    }
    return {node:null};
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
  console.log(len)
  for (let i = 0; i < len; i++) {
    console.log(i)
    childPatches.push(diff(old.children[i], newD.children[i]));
  }

  return {
    node: newD,
    attrPatches,
    childPatches
  };
}

export function patch(parent, patches, index = 0) {
  // console.log(patches)
  // if (patches.node === null && !parent.childNodes[index]) {
  //   console.log("hello")
  //   return;
  // }
  if (parent.TEXT_NODE === 3){
    console.log("hnaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" , patches);

    return
  }
  if (!patches) {
    if (parent.childNodes[index]) {
    parent.removeChild(parent.childNodes[index]);
  }
    return;
  }
  console.log("index: " , index  , "patches", patches);
  
  if (parent.childNodes[index] === undefined) {    
    render(patches.node,parent);
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
    console.log(childNode, "childNode" , "patches", );
    
    for (let i = 0; i < patches.childPatches.length; i++) {
      patch(childNode, patches.childPatches[i], i);
    }
    return; 

  }
  if (typeof patches.node === 'string' || typeof patches.node === 'number') {
    parent.childNodes[index].textContent = patches.node
  }
}