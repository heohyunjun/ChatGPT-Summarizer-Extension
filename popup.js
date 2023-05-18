
///이 구성은 버튼을 클릭하면 배경 스크립트가 실행되고, 
///배경 스크립트는 현재 탭에서 content.js를 실행하도록 지시합니다. 
///이후, content.js 스크립트는 주어진 선택자를 사용하여 요소를 선택하고, 
///그 요소의 텍스트를 콘솔에 출력합니다.
///이렇게 하면, popup.html의 버튼을 클릭하면 현재 탭에서 
///content.js가 실행되어 웹페이지의 특정 요소의 텍스트를 출력하게 됩니다.
// document.getElementById('myButton').addEventListener('click', () => {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id },
//         files: ['content.js']
//       });
//     });
//   });
  
// document.querySelector("#toggleSwitch").addEventListener('change', (event) => {
//     let newValue = event.target.checked;

//     // background script에 메시지를 보냅니다.
//     chrome.runtime.sendMessage({cmd: 'TOGGLE_BUTTON', value: newValue});

//     // chrome storage에 값을 업데이트합니다.
//     chrome.storage.sync.set({isButtonEnabled: newValue});
// });
// popup.js

document.addEventListener('DOMContentLoaded', function () {
  var toggleSwitch = document.querySelector('#toggleSwitch');

  if (toggleSwitch) {
    // 팝업이 열릴 때마다 토글의 상태를 확인합니다.
    chrome.storage.local.get('isButtonEnabled', function(data) {
      if (data.hasOwnProperty('isButtonEnabled')) {
        toggleSwitch.checked = data.isButtonEnabled;
      }
    });

    toggleSwitch.addEventListener('change', function () {
      // 토글의 상태를 변경하고, background script에 메시지를 보냅니다.
      chrome.storage.local.set({isButtonEnabled: toggleSwitch.checked}, function() {
        console.log('Value is set to ' + toggleSwitch.checked);
      });

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length > 0) {
          chrome.runtime.sendMessage({cmd: 'TOGGLE_BUTTON', value: toggleSwitch.checked, tabId: tabs[0].id});
        }
      });
    });
  }
});

