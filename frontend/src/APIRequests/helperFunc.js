export function buildQueryString(name, ids){
	if(ids.length===0){return name + '='}
	let s = '';
	for(let i =0; i<ids.length-1;i++){
		s += name + '=' + ids[i] + '&';
	}
	s += name + '=' + ids[ids.length-1];
	return s;
}