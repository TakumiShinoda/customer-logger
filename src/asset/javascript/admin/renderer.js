const request = new XMLHttpRequest();

function send(){
  var task = $('.task')[0].value;
  var number = parseInt($('.customer-number')[0].value);
  switch(task){
    case '追加':
        request.open('POST', 'http://localhost:4126');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send('{"task": "add","id": '+number+'}');
      break;
    case '削除':
        request.open('POST', 'http://localhost:4126');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send('{"task": "delete","id": '+number+'}');
      break;
    default:
        alert('問題が発生しました。\n再起動してください。')
      break;
  }
}
