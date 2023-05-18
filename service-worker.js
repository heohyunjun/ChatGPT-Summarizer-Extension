function setStoragePromise(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({[key]: value}, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log('Value is set to ' + value);
        resolve();
      }
    });
  });
}

function queryTabsPromise() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs);
      }
    });
  });
}

function sendMessagePromise(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, function(response) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log('메시지가 성공적으로 전송되었습니다.');
        resolve(response);
      }
    });
  });
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.cmd === 'TOGGLE_BUTTON') {
    try {
      await setStoragePromise('isButtonEnabled', request.value);
      let tabs = await queryTabsPromise();
      if (tabs.length > 0) {
        await sendMessagePromise(tabs[0].id, {cmd: 'TOGGLE_BUTTON', value: request.value});
      }
      sendResponse({status: 'success'});
    } catch (error) {
      console.error('Failed to set value or send message', error.message);
    }

    return true;  // 리스너가 비동기 응답을 보낼 것임을 나타냅니다.
  }
});

