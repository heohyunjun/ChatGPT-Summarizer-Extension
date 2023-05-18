let newButton = null; // 이전에 만든 버튼을 추적합니다.
let observer = null;

function addButton() {
    if (newButton) {
        return;
    }
    let inputFieldXPath = "//*[@id='__next']/div[2]/div[2]/div/main/div[3]/form/div/div[2]/textarea";
    let sendButtonXPath = "//*[@id='__next']/div[2]/div[2]/div/main/div[3]/form/div/div[2]/button";
    let buttonContainerXPath = "//*[@id='__next']/div[2]/div[2]/div/main/div[3]/form/div";

    let inputField = document.evaluate(inputFieldXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let sendButton = document.evaluate(sendButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let buttonContainer = document.evaluate(buttonContainerXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (inputField && sendButton && buttonContainer) {
      newButton = document.createElement("button");
      newButton.textContent = "뉴스 요약";
      newButton.style.position = "absolute";
      newButton.style.top = "0";
      newButton.style.right = "0";

      newButton.style.border = "2px solid white";
      newButton.style.backgroundColor = "transparent";
      newButton.style.color = "white";
      newButton.style.padding = "5px";

      // newButton.onclick = function() {
      //   inputField.value = "안녕하세요 " 
      //   sendButton.click();
      // };

      newButton.onclick = function() {
        inputField.value = `
너의 역할은 해외 증권 뉴스를 한국어로 요약하는 한국 증권사 직원이다
너가 요약한 뉴스는 일반인들이 읽기때문에 이해하기 쉽도록 한국어로 요약해야한다
70단어 이내로 요약해라
2가지 포맷을 지켜라
- 제목 : <제목>
- 요약 :  <요약>
    ${inputField.value}`;
        sendButton.click();
    };
    

    
      buttonContainer.appendChild(newButton);
    }
}

function removeButton() {
    if (newButton) {
        newButton.remove();
        newButton = null;
    }
}

chrome.storage.sync.get('isButtonEnabled', function(data) {
    if (data.isButtonEnabled) {
        addButton();
    } else {
        removeButton();
    }
});

// 리스너 함수를 별도로 정의합니다.
function onMessageListener(request, sender, sendResponse) {
  if (request.cmd === "TOGGLE_BUTTON") {
    chrome.storage.local.set({ isButtonEnabled: request.value }, function() {
      console.log('Value is set to ' + request.value);
    });

    if (request.value) {
      addButton();
    } else {
      removeButton();
    }
  }
}

chrome.runtime.onMessage.addListener(onMessageListener);

let titleElement = document.querySelector('head > title'); 

if (titleElement) {
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // setTimeout을 사용하여 1초 후에 addButton 함수를 호출합니다.
        setTimeout(() => {
          chrome.storage.sync.get('isButtonEnabled', function(data) {
            if (data.isButtonEnabled) {
              addButton();
            }
          });
        }, 1000);
      }
    });
  });

  observer.observe(titleElement, { childList: true, subtree: false });
}

// 페이지나 탭이 unload될 때 이벤트 리스너를 제거합니다.
window.addEventListener('unload', function() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    // 정확한 리스너를 제거합니다.
    chrome.runtime.onMessage.removeListener(onMessageListener);
}, false);
