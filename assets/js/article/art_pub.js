$(function(){
  var layer = layui.layer
  var form = layui.form
  initCate()
  initEditor()
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用 form.render() 方法
        form.render()
      }
    })
  }
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  $('#btnChooseImage').on('click', function() {
    $('#coverFile').click()
  })

  $('#coverFile').on('change',function(e){
    var files = e.target.files
    if(files.length ===0){
      return
    }
    var newImgURL = URL.createObjectURL(files[0])
    $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', newImgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
  })
  var art_state = '已发布'
  $('#btnSave2').on('click',function(){
    srt_state = '草稿'
  })
  
  //为表单绑定submit提交事件
  $('#form-pub').on('submit',function(e){
    e.preventDefault()
    
    var fd = new FormData(this)
    fd.append('state',art_state)
    $image
    .cropper('getCroppedCanvas',{
      width:400,
      height:280
    })
    .toBlob(function(blob){
      //将文件对象村存到fd里面
      fd.append('cover_img',blob)
      publishArticle(fd)

    })
  })

 function publishArticle(fd){
   $.ajax({
     method:'POST',
     url:'/my/article/add',
     data:fd,
     contentType: false,
     processData: false,
     success:function(res){
       if(res.status !==0){
         return layer.msg('发布文章失败！')
       }
       layer.msg('发布文章成功！')
       location.href = '/article/art_list.html'
     }
   })
 }



})