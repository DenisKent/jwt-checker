const button = document.getElementById("button");
const jwtList = document.getElementById("jwtList");

console = chrome.extension.getBackgroundPage().console;

chrome.storage.onChanged.addListener(() => {
  let jwtTextNode = document.createTextNode(JSON.stringify("here2"));
  jwtList.appendChild(jwtTextNode);
  console.log("storage changed")
  chrome.storage.local.get(['jwts'], (result) => {
    console.log('Value currently is ' + result);
  });
})

const formatObjectForDisplay = (obj) => {
  const div = document.createElement("div");
  const start = document.createElement("p");
  start.textContent = "{"
  div.appendChild(start);
  Object.keys(obj).forEach((key)=> {
    const keyValue = document.createElement("p");
    keyValue.textContent = `"${key}" : ${obj[key]}`;
    div.appendChild(keyValue);
  })
  const end = document.createElement("p");
  end.textContent = "}"
  div.appendChild(end);
  return div;
}

chrome.storage.local.get(['jwts'], ({jwts}) => {
  if(!jwts.length) {
    const userMessage = document.createTextNode("No JWTs found");
    jwtList.appendChild(userMessage);
  }
  jwts.forEach((jwt)=> {
    const div = formatObjectForDisplay(jwt)
    jwtList.appendChild(div);
  })
});