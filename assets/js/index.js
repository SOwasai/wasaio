$(function(){
  //调用getUserInfo  获取用户信息
  getUserInfo()

  $('#btnLogout').click(function(){
    layer.confirm('确定退出登录？',{ icon:5, title:'提示'},function(index){
      localStorage.removeItem('token')
      location.href ='/login.html'
    })
    layer.close(index)
  })
  
})
function getUserInfo(){
  $.ajax({
    method:'GET',
    url:'/my/userinfo',
    //Headers 就是请求匹配对象
    // headers:{
    //   Authorization:localStorage.getItem('token') ||''
    // },
    success:function(res){
      console.log(res);
      if(res.status !==0){
        return layui.layer.msg('获取用户信息失败！')
      }
      renderAvatar(res.data)
    }
  })
}

function renderAvatar(user){
  var name = user.nickname || user.username
  //设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
  //渲染用户的头像
  if(user.user_pic !==null){
    $('.layui-nav-img').attr('src',user.user_pic).show()
    $('.text-avatar').hide()
  }else {
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
