export default function (filter) {
  let cond;
  if (typeof filter === 'function') {
    cond = filter;
  } else if (typeof filter === 'string') { 
    cond = d => d.data.key !== filter;
  } else if (typeof filter === 'object' && filter.data) {
    cond = d => d.data.key !== filter.data.key;
  } else if (typeof filter === 'object') {
    cond = d => d.data.key instanceof Date ? d.data.key - filter !== 0 : false;
    if (filter instanceof Date) return cond = d => d.data.key instanceof Date ? d.data.key - filter !== 0 : false;
    else cond = d => d.data.key !== filter;
  } 
  return cond;
}