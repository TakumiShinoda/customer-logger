const request = new XMLHttpRequest();
var connectedUrl = null;

$(document).ready(() => {
  openModal('inputIPModal');
});

function send(){
  var task = $('.task')[0].value;
  var number = parseInt($('.customer-number')[0].value);
  switch(task){
    case '追加':
      $.ajax({
        url: connectedUrl,
        type: 'POST',
        headers: {'Content-Type':'application/json'},
        data: '{"task": "add", "id": '+number+'}',
        success: function(data){
            openModal('sendCompModal');
            setTimeout(() => {
              closeModal('sendCompModal')
            }, 1500);
        },
        error: function(data) {
            alert('正しいIPを入力してください。');
        }
      });
      break;
    case '削除':
      $.ajax({
        url: connectedUrl,
        type: 'POST',
        headers: {'Content-Type':'application/json'},
        data: '{"task": "delete", "id": '+number+'}',
        success: function(data){
            console.log(data)
            openModal('sendCompModal');
            setTimeout(() => {
              closeModal('sendCompModal')
            }, 1500);
        },
        error: function(data) {
            alert('正しいIPを入力してください。');
        }
      });
      break;
    default:
        alert('問題が発生しました。\n再起動してください。')
      break;
  }
}

function activate(){
  let ipAdress = $('.IPAdress')[0].value;
  let port = $('.serverPort')[0].value;
  let vldobj = {'ip': ipAdress, 'port': port};
  console.log(vldobj)
  let vldop = {
    'ip': 'required',
    'port': ['required', 'numeric', {'max': 65535}],
  }

  if(new Validator(vldobj, vldop).passes()){
    var url = 'http://' + ipAdress + ':' + port;
    $.ajax({
      url: url,
      type: 'POST',
      headers: {'Content-Type':'application/json'},
      data: '{"task": "act", "id": 38}',
      success: function(data){
          connectedUrl = url;
          alert(data);
          closeModal("inputIPModal");
      },
      error: function(data) {
          alert('正しいIPを入力してください。');
      }
    });
  }else{
    alert('IPアドレスまたはポート番号が正しくありません。');
  }
}

function disconnect(){
  console.log(connectedUrl)
  $.ajax({
    url: connectedUrl,
    type: 'POST',
    headers: {'Content-Type':'application/json'},
    data: '{"task": "dis", "id": 0}',
    success: function(data){
    },
    error: function(data) {
      alert('既にサーバーと切断されています。')
    }
  });
}
