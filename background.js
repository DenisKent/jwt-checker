console.log("in background");

const searchForJwts = () => {
  chrome.browserAction.setIcon({path:"extension-inactive.png"});
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = tabs[0].url;
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/gi,".").split("/")[0];
    chrome.cookies.getAll({domain},(cookies) => {
      const jwtPayloads = cookies.reduce((acc, cookie)=> {
        const decodedCookie = decodeJWT(cookie.value);
        if(decodedCookie && decodedCookie[0].typ && decodedCookie[0].typ.toLowerCase() === "jwt"){
          return [...acc, decodedCookie[1]];
        } else {
          return acc;
        }
      },[]);
      if(jwtPayloads.length) chrome.browserAction.setIcon({path:"extension-active.png"});
      chrome.storage.local.set({jwts: jwtPayloads}, () => {
        console.log('jwtPayloads is set to ' + jwtPayloads);
      });
    });
  })
}

chrome.tabs.onActivated.addListener(()=> {
  console.log("tab activated")
  searchForJwts();
})

chrome.tabs.onUpdated.addListener(()=> {
  console.log("url changed")
  searchForJwts();
});

const decodeJWT = (jwtString) => {
  if(!jwtString)return null;
  const splitJwt = jwtString.split(".");
  if(splitJwt.length !== 3){
    return null
  }
  const [header, payload] = splitJwt;
  try {
    const decodedHeader = window.atob(header.replace("-","+").replace("_","/"));
    const decodedPayload = window.atob(payload.replace("-","+").replace("_","/"));
    return [JSON.parse(decodedHeader), JSON.parse(decodedPayload)];
  } catch (err){
    return null;
  }
};