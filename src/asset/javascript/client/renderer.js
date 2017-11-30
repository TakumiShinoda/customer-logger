ipcRenderer.on('addCustomer', (ev, id) => {
  $('ul#content').append('<li id=list class='+ id +'><span class='+ id +'>'+ id +'</span> - 02:00</li>')
});

ipcRenderer.on('deleteCustomer', (ev, id) => {
  var contentList = $('li#list').children('span');
  var idList = [];

  for(var i = 0;i < contentList.length; i++){
    idList.push(contentList[i].textContent);
  }

  if(idList.indexOf(String(id)) >= 0){
    $('.'+String(id)).remove();
  }else{
    console.log('can not find')
  }
});
