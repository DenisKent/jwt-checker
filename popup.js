const button = document.getElementById("button");
const jwtList = document.getElementById("jwtList");

console = chrome.extension.getBackgroundPage().console;

const decodeJWT = (jwtString) => {
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
}

button.onclick = () => {
  console.log("running on click")
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = tabs[0].url;
    console.log("tab url", url);
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/gi,".").split("/")[0];
    console.log("domain", domain)
    chrome.cookies.getAll({domain},(cookies) => {
      const jwtPayloads = cookies.reduce((acc, cookie)=> {
        const decodedCookie = decodeJWT(cookie.value);
        if(decodedCookie && decodedCookie[0].typ && decodedCookie[0].typ.toLowerCase() === "jwt"){
          return [...acc, decodedCookie[1]];
        } else {
          return acc;
        }
      },[]);
      console.log(jwtPayloads);
      let jwtTextNode = document.createTextNode(JSON.stringify(jwtPayloads[0]));
      jwtList.appendChild(jwtTextNode);
    });
  })
};