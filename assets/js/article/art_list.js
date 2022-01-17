$(function(){
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  template.defaults.imports.dataFormat = function(date){
    const dt =new Date(date)
    var y = String(dt.getFullYear())
    var m = String(dt.getMonth()+1).padStart(2,'0')
    var d = String(dt.getDate()).padStart(2,'0')
    var hh = String(dt.getHours()).padStart(2,'0')
    var mm = String(dt.getMinutes()).padStart(2,'0')
    var ss = String(dt.getSeconds()).padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  //定义一个查询的参数对象，将来请求数据的时候 
  //需要将请求的参数对象提交到服务器
  var q ={
    pagenum:1, //页码值，默认请求第一页的数据
    pagesize:2, //每页显示几条数据，默认每页显示两条
    cate_id:'', //文章分类的ID
    state:''  //文章的发布状态
  }
  

  initTable()
  initCate()

  //获取文章列表数据的方法
  function initTable() {
    
    $.ajax({
      method:'GET',
      url:'/my/article/list',
      data: q,
      success:function(res){
        console.log(res);
        
        if(res.status !==0){
          return layer.msg('获取文章列表失败！')
        }
        var htmlStr = template('tpl-table',res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
      

    })
  }
 
  function initCate(){
    $.ajax({
      method:'GET',
      url:'/my/article/cates',
      success:function(res){
        if(res.status !==0){
          return layer.msg('获取分类数据失败！')
        }
        var htmlStr = template('tpl-cate',res)
        $('[name=cate_id]').html(htmlStr)
        form.render()

      }
    })
  }

  $('#form-search').on('submit',function(e){
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
    
  })
  function renderPage(total){
    laypage.render({
      elem:"pageBox",
      count:total,
      limit:q.pagesize,
      curr:q.pagenum,
      layout:['count','limit','prev','page','next','skip'],
      limits:[2,3,4,5,10],
      //分页发生切换的时候，触发jump回调
      //触发jump回调的方式有两种：
      //1.点击页面的时候，触发jump函数
      //2.render调用的时候就会调用jump
      jump:function(obj,first){  
        q.pagenum=obj.curr
        q.pagesize=obj.limit
        //根据最新的q获取对应的数据列表，并渲染表格
        if(!first){

          initTable()
        }
      }
    })
    
  }
  //通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function() {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    console.log(len)
    // 获取到文章的 id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })

      layer.close(index)
    })
  })
})