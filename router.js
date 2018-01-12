module.exports = {
  routes: ['index', 'client', 'admin'],
  methods:{
    cur_view: () => {
      var url = location.pathname;
      var urlArr = url.split('/');
      return urlArr[urlArr.length - 2];
    }
  }
}
