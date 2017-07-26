export default function parseSearch(searchString) {
  let pairSplit;
  return (searchString || '').replace(/^\?/, '').split('&').reduce((p, pair) => {
    pairSplit = pair.split('=');
    if (pairSplit.length >= 1) {
      if (pairSplit[0].length) {
        if (pairSplit.length >= 2 && pairSplit[1]) {
          p[decodeURIComponent(pairSplit[0])] = decodeURIComponent(pairSplit[1]);
        } else {
          p[decodeURIComponent(pairSplit[0])] = '';
        }
      }
    }
    return p;
  }, {});
}