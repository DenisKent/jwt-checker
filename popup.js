const button = document.getElementById("button");
const jwtList = document.getElementById("jwtList");

console = chrome.extension.getBackgroundPage().console;

const decodeJWT = (jwtString) => {
  const splittedJwt = jwtString.split(".");
  if(splittedJwt.length !== 3){
    return null
  }
  const payload = splittedJwt[1];
  try {
    const decodedPayload = window.atob(payload.replace("-","+").replace("_","/"));
    return decodedPayload;
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
    chrome.cookies.getAll({domain},function (cookies){
      console.log("here are the cookies", cookies)
      const gstCookie = cookies.filter((cookie)=> cookie.name === "gst")[0];
      const jwt = gstCookie.value
      console.log("before decoding", jwt);
      const jwtDecoded = decodeJWT(jwt);
      console.log("decoded",jwtDecoded);
      let jwtTextNode = document.createTextNode(jwtDecoded);
      jwtList.appendChild(jwtTextNode);
    });
  })
};