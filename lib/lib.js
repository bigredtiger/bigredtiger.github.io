function lib(node) {
	function append(tpl) {
		node.insertAdjacentHTML('beforeend', tpl);
	}
	
	function prepend(tpl) {
		node.insertAdjacentHTML('afterbegin', tpl);
	}
	
	function insert(tpl) {
		node.innerHTML = tpl;
	}
	
	function toggleClass(cls) {
		const currentCls = node.className;
		const clsList = currentCls.split(' ');
		
		if (currentCls.includes(cls)) {
			clsList.splice(clsList.length - 1, 1);
			node.className = clsList.join(' ');
		} else {
			node.className = `${currentCls} ${cls}`;
		}
	}
	
	function style(key, val) {
		node.style[key] = val;
	}
	
	function show() {
		node.style.display = 'block';
	}
	
	function hide() {
		node.style.display = 'none';
	}

	function setAttr(key, val) {
		node.setAttribute(key, val);
	}

	function removeAttr(key) {
		node.removeAttribute(key);
	}

	function listener(action, func) {
		node.addEventListener(action, func, false);
	}
	
	return {
		node,
		append,
		prepend,
		insert,
		toggleClass,
		style,
		show,
		hide,
		setAttr,
		removeAttr,
		listener
	};
}


export const el = (id) => lib(document.getElementById(id));

export const qry = (sel) => lib(document.querySelector(sel));

export const qryAll = (sel, i) => lib(document.querySelectorAll(sel)[i]);

export function rand(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
}

export const sleep =  s => new Promise(resolve => setTimeout(resolve, s * 1000));

export function log() {
	let txt = '';
	
	if (arguments.length > 1) {
		for (const arg of arguments) {
			txt = `${txt}${arg} `;
		}
	} else {
		txt = arguments[0];
	}
	
	console.log(txt);
}

export function sortDesc(list, prop) {
	const copy = list.slice();
	
	return copy.sort((a, b) => prop ? b[prop] - a[prop] : b - a);
}

export const renderColorText = (text, color) => `<span style="color: ${color}">${text}</span>`;

