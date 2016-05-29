/**
 * MuTable is jQuery plugin table create auto table and CRUD
 * 
 * @param {type} $
 * @returns {undefined}
 */

// JavaScript Document  
(function($){  
        // setbackground คือชื่อของ plugin ที่เราต้องการ ในที่นี้ ใช้ว่า  setbackground  
        $.fn.Mutable = function( options ) { // กำหนดให้ plugin ของเราสามารถ รับค่าเพิ่มเติมได้ มี options
            // ส่วนนี้ สำหรับกำหนดค่าเริ่มต้น  
            var defaults={
                pk:'%',
                start:1,
                numbrows:15,
                xcolumn:'', //[{field:xx,type:yy},..]
                choice:'', //as associate array {x:{},y:{}}
                modals : '', //[edit,search]
                url:'#',   //as ajax url for select query data list
                actions_btn : '', //as create button for actions column [edit,delete,details]
                insert_url:'#', //as ajax insert
                update_url:'#',//as ajax update
                delete_url:'#', // as ajax delete url
                data:'',    //data source
                search:true,  //true or false
                realtime: false, //true or false
                checkfunction: function(){},
                DeleteCallBackFn:function(){
                  btn_delete_edit(); 
                },
                PaginateCallBackFn:function(){
                    surl = settings.url;
                    var sdata = sentdata;
                    //alert(surl);
                  //  paginator(surl,sdata);
                    
//                    $('.pagination li a').on('click',function(){
//                        pg_numb = $(this).text();
//                        //alert(pg_numb);
//                        console.log('from call PainateCallBackFn');
//                        go_to_page(pg_numb);
//                    })
                },
                AddCallBackFn:function(){
                  //add();
                  add_fn();
                },
            }; 
            
            
            var settings = $.extend( {}, defaults, options );
            //, begin: settings.start 
            sentdata={ begin: settings.start, rows: settings.numbrows,
                //morder:[{col:'BulkID',ord:'ASC'},{col:'BulkNameTH',ord:'DESC'}]
            };
            xcolumn = settings.xcolumn;
            var fieldpk = '';
            $.each(xcolumn,function(x,y){
                y.type = 'pk';
                fieldpk = y.field;
                return false;
            });
            sentdata[fieldpk] = settings.pk;
            surl = settings.url;
            durl = settings.delete_url;
            uurl = settings.update_url;
            curl = settings.insert_url;
            act_btn = settings.actions_btn;
            choice = settings.choice;
            //console.log('delurl= ' +settings.delete_url); 
             
            //**
            // create function add
            // this function have two process with the same method
            //  insert and update method.
            
            function add_fn(){
                
                $('#add').click(function(){
                    //alert('add');
                    var new_row = 0;
                    var obj_sl = obj_select;
                    var attr_sl = attr_select
                    var txt = 'addfunction : insert_url= '+ settings.insert_url +
                      'update_url= '+settings.update_url ;
                    //console.log(txt);
                    //alert(txt + '  '+ obj_sl + " " + attr_sl );
                    $(attr_sl + "modal_title_" +obj_sl + "_edit").text("เพิ่มข้อมูล");
                    change_data_modal();
                    var obj_selector = $(attr_sl+"modal_"+obj_sl+"_edit");
                    new_row = count_row_table();
                    //console.log('new row = '+new_row);
                    obj_selector.attr('data-row',new_row);
                    //$('#modal_mytable_edit').find('[name="BulkID"]').prop('readonly',false);
                    //$(attr_sl +"modal_"+ obj_sl + "_edit").modal('show');
                    if (obj_selector.attr('data-edit-html')) {
                       // console.log('data-edit-html is exist');
                        obj_selector.removeAttr('data-edit-html');
                    }
                        obj_selector.attr('data-add-html',curl);
                    
                    
                    obj_selector.find('[data-pk="pk"]').prop('readonly',false);
                    obj_selector.modal('show');
                    
                });
                
            }
            
            function delete_fn(){
               alert(settings.delete_url);
              // btn_delete(settings.delete_url);
            }
            
            
            //alert('opt= '+ JSON.stringify(options));
            /// คืนค่ากลับ การทำงานของ plugin  
            var obj = $(this);
            return this.each(function() {
                //var obj =$(this);
                //alert(JSON.stringify(obj));
                var rowtable = '';
                
                

                // โค้ตสำหรับ การทำงานของ plugin
                //alert(settings.url);
                var sent_url = {"r":settings.url};
                
                //ตรวจสอบว่ามีการเก็บค่า begin(เริ่มต้น) ของหน้าเว็บไว้หรือไม่
                //var sess_begin = sessionStorage.getItem('begin');
                var obj_sess_data = JSON.parse(sessionStorage.getItem('sess_data'));
                //obj_sess_data.begin
                //if (sess_begin != null){
                if ( obj_sess_data != null ){
                    //sentdata.begin = sess_begin;
                    //sentdata.begin = obj_sess_data.begin;
                    sentdata = obj_sess_data;
                    //console.log('sentdata begin by session = '+ sess_begin);
                }else{
                    sentdata.begin = 1;
                }
                
                ajaxload(sent_url,sentdata);
                var pagebegin = sentdata.begin;
                pagination(pagebegin);
               
                
                //create blank table
                var blank_table = create_table(r_datas);
                    obj.find('tbody').html(blank_table);
                    
                    //Add value on html table
                    add_data_table(r_datas) 
                    
                //create search box
                if (settings.search == true){
                    obj.before(searchbox());
                };
                // $('#xxx').mtable()  = selector is xxx on jquery
                attr_select = obj.selector.substring(0,1);
                obj_select = obj.selector.substring(1);
                    //console.log(str_search);
                    //create default modals :
                set_modals = settings.modals;
                $.each(set_modals , function(k,v){
                    create_modal(obj_select,v);
                    
                });
               //==========================================//
               //  change to $.each()
//                    create_modal(obj_select,'search');
//                    create_modal(obj_select,'edit');
//             //==========================================//       
//                    
                    //create_modal(obj_select,'add');
                //add event click save button by function save(){}
                    save();
                //binding event click on search button after create modal search
                    search_click(obj_select,'search');
                
//                $('[name=search]').focus(function(){
//                   // alert('focus');
//                    //call function modal_search()
//                    //$(this).toggleclass('');
//                    $(this).width(500);
//                    
//               
//                    console.log(xcolumn);
                    search();
//                });
                
//                $('#search').click(function(){
//                   // s_text = $('[name="search"]').val();
//                    //alert(s_text);
//                    console.log('click search show modal search');
////                    var srchdata = datas.data;
////                    var xtable = $.grep(srchdata,function(val,i){
////                        return val.begin  ;
////                    });
////                   console.log('srch='+ srchdata + '  s_text + ' + xtable);
//                });

                
                //create add button
                var btnx = create_add_button();
                $('.toolbar').prepend(btnx);

                //create pagination
  // var paginate = pagination(1);
  //bindClickPagination()
                
                //obj.after(pagination());

                
                //create add data button 
                
                
                //create table by function append_table 
                //alert('in : ' + settings.xcolumn);
                
    //stop            rowtable = append_table();
    //stop            var xk = obj.find('tbody').html(rowtable);
                //alert(xk);
                //create pagination 
                

                //callback function delete button
                settings.DeleteCallBackFn.call();
               
                //callback function pagination
                settings.PaginateCallBackFn.call();
                
                settings.AddCallBackFn.call();
                
                //test obj event click attribute
                settings.checkfunction.call(obj);
            });  // end return for chaining
           
//      obj.keyup(function(){
//          alert('key up');
//      });
//        alert('befor paginate');
//        $('.pagination li a').on('click',function(){
//            
//            pg_numb = $(this).text();
//            alert(pg_numb);
//            go_to_page(pg_numb);
//        })
        
//      function paginator(url,sentdata){
//          //go_to_page();
//          //alert('ajax datas: '+ JSON.stringify(datas));
//          var surl = url;
//          var ltx='';
//          var sdata='';
//          var rowtable='';
//          //sdata = sentdata.begin;
//          //$('.pagination li a').click(function(){
//         //     call_paginate($(this),surl,sentdata );
//         // });
          
//          $('.pagination li a').click(function(){
//              //alert();
//              ltx = $(this).text();
//              //alert(ltx + 'this ='+ $(this).text());
//              sentdata.begin = ltx;
//              console.log('sentdata= '+ JSON.stringify(sentdata));
//              //alert(JSON.stringify(sentdata));
//              ajaxload(surl,sentdata);
//              rowtable = append_table();
//              $('tbody').html(rowtable);
//             // settings.DeleteCallBackFn.call();
//             
              //$('.Detete').trigger(btn_delete());
//             
//              
//              //pagination(ltx);       //stop
//              //$(this).trigger(ccc);
//              //$().trigger(pagination());
//              //alert(surl+'/'+ltx + " data= " + sdata + 'col= '+ JSON.stringify(options));
//          });
            
            
//      }; // End of paginator function
           
//    function bindClickPagination(){
//        $('.pagination li a').on('click','li a', function(){
//            var pgnumb = $(this).text();
//            alert('ul pagingaiton='+ pgnumb);
//        });
//    } // end of bindClickPagination()
    function get_critical_search(){
        var txt = '';
        $.each(sentdata,function(k,v){
            if (!(k == 'begin' || k == 'rows')){
                txt += k + ' = ' + v +', ';
            }
        });
        return txt ;
    }
    
    function search() {
          //modal_s = 'xxx';
        var modal_s = $(attr_select+'btn_'+obj_select+'_search');
        var txt_srch='';
        modal_s.on('click',function(){ 
            //console.log(modal_s.html());
        srch_data = get_val_modal('r');
        sentdata = srch_data;
        sentdata['begin'] = 1;
        //srch_data['begin'] =1;
        sentdata['rows'] = 15;
        //srch_data['rows'] = 15;
        //console.log('sent  data '+ settings.url + '  surl='+surl);
        //console.log(sentdata);
        //update sessionStorage.setItems('sess_data',JSON.stringify(sentdata))
        set_sessionstorage();
        ajaxload({'r': surl},sentdata);
        
        hide_show_table();
        //var pagebegin = srch_data.begin;
        var pagebegin = sentdata.begin;
        pagination(pagebegin);
        
        //create blank table
//        var blank_table = create_table(r_datas);
//        $(attr_select + obj_select).find('tbody').html(blank_table);

            //Add value on html table
        add_data_table(r_datas);
        //console.log(r_datas);
            if ( r_datas.total == 0 ) {
                alert("ไม่พบข้อมูลที่ต้องการค้นหา.... \n\
                กรุณาค้นหาใหม่อีกครั้ง...!!!");
            }else{
                //console.log('search ok!');
                //modal_s.modal('hide');
                $('#modal_'+obj_select+'_search').modal('hide');
                txt_srch = get_critical_search();
                console.log('txt search = '+ txt_srch);
                $('#txt_search').text(txt_srch).parent().removeClass('none');
                
            }
        });

    }
      //alert(JSON.stringify(obj));
    
    
    }; // End of fn.mtable
 
// })(jQuery);   
 
//============================================//
//     Cancel function go_to_page()           //
//============================================//
//function go_to_page(pagenumb){
//   console.log('gotopate = '+ pagenumb);
//   
//   //create pagination;
//   pagination(pagenumb);
//   
//   //break onclick function 
//   //$('.pagination li a').prop('onclick',null).off('click');
//   //alert('pagenumb='+ pagenumb);
//   
//    var ajaxurl = surl;
//    sentdata.begin = pagenumb;
//    //var sdata = sentdata;
//    //console.log('ajaxurl ='+ajaxurl+ ' ;sentdata'+JSON.stringify(sentdata));
//    ajaxload(ajaxurl,sentdata);
//    rowtable = append_table();
////    ox = $.fn.mtable.obj.html();
////    alert(ox);
//   // $('#mytable').find('tbody').html(rowtable);
//    //$('#mytable').find('tbody').children('tr').hide();
//    $('#mytable').find('tbody').children('tr').remove();
//    $('#mytable').find('tbody').append(rowtable);
//    btn_delete();
//};
//============================================//
//   End Cancel function go_to_page()           //
//============================================//


  


    
//function call_paginate(x,url,sdata){
//     $('.pagination li a').click(function(){
//              //alert('call paginate');
//              objx = x;
//              ltx = objx.text();
//              //alert(ltx + 'this ='+ $(this).text());
//              sentdata.begin = ltx;
//              console.log('x= '+ x +' ;sentdata= '+ JSON.stringify(sentdata));
//              //alert(JSON.stringify(sentdata));
//              var read_url = {"r":url};
//              ajaxload(read_url,sdata);
//              rowtable = append_table();
//              $('tbody').html(rowtable);
//             // settings.DeleteCallBackFn.call();
//              //$('.Detete').trigger(btn_delete());
//              
//              
//              
//              //pagination(ltx);       //stop
//              //$(this).trigger(ccc);
//              //$().trigger(pagination());
//              //alert(surl+'/'+ltx + " data= " + sdata + 'col= '+ JSON.stringify(options));
//          });
//    
//};
//============= finish core myfunction =====================//
//==========================================================//
//======== begin function for called by core myfunction ====//

/**
 * @param {json key value} ajaxurl exp:{crud:url}
 *        crud as 'c'->create
 *             as 'r'->read
 *             as 'u'->update
 *             as 'd'->delete
 * @param {array} sentdata
 * @returns {undefined}
 */
function ajaxload(ajaxurl,sentdata){
    var param = ajaxurl ;
    var crud = '',
        ajx_url = '';

    $.each(param, function(k, v) {
        crud  = k;
        ajx_url = v;
    });
   //console.log(crud + '  url= ' + ajx_url);
    $.ajax({
        type:"POST",  
        url: ajx_url,  
        data: sentdata,
        async: false,
        dataType: 'json',
        success: function(data){
           //console.log('ajx crud = '+ crud);
           window[crud+'_datas'] = data;
           if (crud == 'u') { //update
               var rowid = $(attr_select+'modal_'+obj_select+'_edit').attr('data-row');
               //alert('rowid u = '+ rowid);
               change_data_table(rowid,'u');
           } else if (crud == 'c') { //create
               var new_rowid = count_row_table();
               //c_datas.data[0]['isort'] = new_rowid;
               change_data_table(new_rowid,'c');
           } else if (crud == 'd') { //delete
               console.log('delete data = ');
               if ( d_datas.delete == 1 ) {
                   alert('ลบข้อมูลเรียบร้อย');
               }else{
                   alert('ข้อมูลไม่ได้ถูกลบ!! (+_+) !!');
               }
               //console.log(d_datas);
           }
           //datas = data;
           //datax = JSON.stringify(datas);
        },
        error: function(xhr, ajaxOption, thrownError){
            var show ="";
            show = 'error!!!-->status: ' + xhr.status + ' statusText: ' 
                   + xhr.statusText + ' responseText: ' + xhr.responseText;
            console.log(show);
        } //end error

    });
}

/**
 * function create_table()
 * @returns {String}  as table_string
 */
function hide_show_table(){
    var tbl_row_count = count_row_table() - hide_row_table(); //จำนวนแถวตาราง
    //var set_row = r_datas.row;
    var lng_row = r_datas.data.length;   //จำนวนข้อมูล
    var k = 0;

    if ( lng_row < tbl_row_count ) {  
        //ถ้าจำนวนข้อมูล < จำนวนแถวตาราง ให้ ซ่อนแถว ที่เกินมา
        for ( k = lng_row; k < tbl_row_count; k++ ){
            +k;
            //console.log('row hide = '+k);
            //$('[id="'+k+'"]').hide();
            $('[id="'+k+'"]').addClass('none');
        }
    }else if (lng_row >= tbl_row_count){
        //ถ้าจำนวนข้อมูล >= จำนวนแถวตาราง ให้ยกเลิกการซ่อนแถว
        for ( k = tbl_row_count; k < lng_row; k++ ){
             +k;
           //console.log('row unhide = '+k);
            //$('[id="'+k+'"]').show();
            $('[id="'+k+'"]').removeClass('none');
        }
    }

//    for ( k = start; k < row_stop; k++ ) {
//            console.log('del id= ' + k);
//            $('[id="'+k+'"]').remove();
//        }
}


function create_table(add_data){
    var bid = xcolumn;
    var xdata = add_data; //r_datas
    var rowtable = ''; // string as html table
    var pkid= ''; // primary key id
    var nsort = 0; // by isort
    var i=0,j=0,k=0; // i as rows , j as columns
    var lng_row = xdata.data.length;
    var lng_col = bid.length;
    var data_pk = '';
    var set_row = r_datas.row;
   // console.log('row='+ lng_row + '   set row = '+ set_row);
//    if (lng_row < set_row) {
//        var del_row = set_row - lng_row;
//        for ( k = lng_row; k < set_row; k++ ) {
//            console.log('del id= ' + k);
//            $('[id="'+k+'"]').remove();
//        }
//    }else if( lng_row == set_row ) {
//        console.log('i= '+ i + '   lng_row= '+lng_row );
//        console.log('count row= '+ count_row_table());
        for ( i = 0; i < lng_row; i++ ) {       //create rows
            rowtable += '<tr class="myrow" id="'+i+'"> ';
            //nsort = xdata.data[i].isort - 1;
            nsort = i;
            for ( j = 0; j < lng_col; j++ ) {   //create columns

                if ( bid[j]['type'] == 'pk')
                {
                    data_pk = 'class="pk"';
                }
                else
                {
                    data_pk = '';
                }
                rowtable += '<td '+data_pk+'>';

                //check column as check
                if ( bid[j]['type'] == 'checked' )
                {
                    rowtable += '<input type="checkbox" value="1" checked="checked" disabled>';
                }
                //else {
                //    rowtable += rowdata;
                //} //end if of bid[j]['type']
                rowtable += '</td>';
            } //end of create columns by xcolumn
            //create action column
            rowtable += '<td width="140px">';  //set width
            //create button inside action column
            $.each(act_btn,function(k,v){
                if (v == "Edit"){
                    rowtable += '<button class="btn btn-xs btn-primary button_custom btnxEdit" ';
                    rowtable += ' data-isort="'+nsort+'">';
                    rowtable += '<i class="glyphicon glyphicon-pencil"></i> แก้ไข</button>';
                }else if (v == "Delete"){
                    rowtable += '<button class="btn btn-xs btn-danger button_custom btnxDelete" ';
                    rowtable += '>'; //onclick="delete_tbl('+"'"+pkid+"'"+')"
                    rowtable += '<i class="glyphicon glyphicon-trash"></i> ลบ</button>';
                }else if (v == "Details"){
                    rowtable += '<button class="btn btn-xs btn-info button_custom btnxDetails " '; //btnxDetails
                    rowtable += '>'; //onclick="show_modal_details('+"'"+pkid+"'"+')"
                    rowtable += '<i class="glyphicon glyphicon-list"></i> รายการ</button>';
                }else{
                    rowtable +='';
                }


            });//end of create button inside action column
            rowtable += '</td>'; //end of tag create action column
        rowtable += '</tr>'; //end of tag create rows
        }; //end of create rows by datas
//    } //end of lng_row == set_row
    //return rowtable string
    //console.log('rtable= '+rowtable);
    return rowtable;    
}


function change_data_table(rowid,crud){ //for create and update action
    var xdata;
    var blank_table ='';
    var this_row = rowid;
    console.log('input crud = '+ crud);
    if ( crud == 'c') // 'c' as create
    {
        xdata = c_datas;
        console.log('c_datas = ');
        console.log(c_datas);
        //create table : create blank table
        blank_table = create_table(xdata);
        //console.log(blank_table);
        $(attr_select+obj_select).find('tbody').prepend(blank_table);
        //old setting
        //obj.find('tbody').prepend(blank_table);
        //
        //var new_row = count_row_table() - 1 ;
        
        $('tbody tr:first').attr('id', this_row);
        //add_data_table : add data on table
        console.log('show c_datas');
        console.log(xdata);
        //push data to r_datas
        c_datas.data[0]['isort'] = Number(this_row) + 1;
        r_datas.data.push(c_datas.data[0]);
        //set event btn click
       // xdata = r_datas;
        btn_delete_edit();
        
    }else{   // 'u'  as update
        u_datas.data[0]['isort'] = Number(this_row) + 1;
        r_datas.data[this_row] = u_datas.data[0];

      //  xdata = r_datas;
        //change data on table at destination rows
    }
    console.log('change data table row ='+ this_row + 'of xdata ');
    console.log(xdata);
    add_data_table(r_datas,this_row);
    
}

function add_data_table(add_data,rowid){ 
    //this function has only data
    var bid = xcolumn;
    var xdata = add_data; //r_datas, c_datas
    var cells_val;  // as array of datas
    var pkid = '', chk;
    var nsort = 0, isort = 0;
    var i = 0;
    var lng_row = 0 //xdata.data.length;
    //console.log('row id = '+rowid);
    if ( rowid == null ){
       i = 0;
       lng_row = xdata.data.length;
    }else{
       i = rowid;
       lng_row = Number(i)+1;
    }
    //console.log('add_data_table i = ' + i);
    var j=0;  //i as rows , j as columns

    var lng_col = bid.length;
    var row_obj ;
    //console.log('i = '+i + '   and lng_row = '+ lng_row);
    for ( i = i; i < lng_row; i++ ) {  //get data of rows
        isort = xdata.data[i].isort;
         
        //console.log('sort = ' +isort);
        nsort  = isort - 1;
        row_obj = $('#'+i+'');
        
        for ( j = 0; j < lng_col; j++ ) { //get data of columns
            cells_val = xdata.data[i][bid[j]['field']];
           //console.log('cells = ' + cells_val);
            row_obj.children('td:eq('+j+')').text(cells_val);
        }
        $('[id='+i+'] .btnxEdit').attr('data-isort',nsort);

    }
    
}
//============================================//
//    this function append_table() ยกเลิกแล้ว    //
//============================================//
//function append_table(){
//    //alert('numb ='+ xdata.data.length + '   : ' + xdata.data);
//    //alert('test datas = '+ datas.data[0].BulkID);
//    //alert('start append: data= '+JSON.stringify(datas)+ ' col='+ xcolumn );
//    var columns = xcolumn;
//    var xdata = r_datas;
//    //alert('xcolumn'+ columns);
//    var rowtable = '';
//    var pkid ='';
//    var chk = '';
//    var nsort = 0;
//    var bid = columns;
//    var i=0,j=0;  //i as rows , j as column
//    var rowdata;
//    
//    for (i=0 ; i < xdata.data.length; i++){
//        rowtable += '<tr class="myrow" id="'+ i +'">' ;
//        nsort  = xdata.data[i].isort - 1;
//        for (j=0; j<bid.length; j++){
//            rowdata = xdata.data[i][bid[j]['field']];
//            rowtable += '<td>';
//            if (bid[j]['type']=='pk')
//            {
//                pkid = rowdata;//xdata.data[i][bid[j]['field']];
//            
//            }
//            
//            if (bid[j]['type']=='checked')
//            {
//                if (rowdata==1){
//                    chk = 'checked="checked"';
//                }else{ 
//                    chk = '';
//                }
//                rowtable += '<input type="checkbox" value="'+ rowdata +'" '+ chk + ' disabled>';
//            }else{
//                rowtable += rowdata;
//            }
//            rowtable += '</td>';
//        }
//        rowtable += '<td width="140px">';
//        $.each(act_btn,function(k,v){
//            if (v == "Edit"){
//                rowtable += '<button class="btn btn-xs btn-primary button_custom btnxEdit" ';
//                rowtable += 'id="' +pkid+ '" data-isort="'+nsort+'">';
//                rowtable += '<i class="glyphicon glyphicon-pencil"></i> แก้ไข</button>';
//            }else if (v == "Delete"){
//                rowtable += '<button class="btn btn-xs btn-danger button_custom btnxDelete" ';
//                rowtable += 'id=x'+pkid+' >'; //onclick="delete_tbl('+"'"+pkid+"'"+')"
//                rowtable += '<i class="glyphicon glyphicon-trash"></i> ลบ</button>';
//            }else if (v == "Details"){
//                rowtable += '<button class="btn btn-xs btn-info button_custom btnxDetails " '; //btnxDetails
//                rowtable += 'id=y'+pkid+' onclick="show_modal_details('+"'"+pkid+"'"+')" >'; //onclick="show_modal_details('+"'"+pkid+"'"+')"
//                rowtable += '<i class="glyphicon glyphicon-list"></i> รายการ</button>';
//            }else{
//                rowtable +='';
//            }
//            
//            
//        });
//    //        rowtable += '<button class="btn btn-xs btn-primary button_custom btnxEdit" ';
//    //        //rowtable += 'id="' +pkid+ '" onclick="edit_tbl('+"'"+pkid+"'"+')">';
//    //        rowtable += 'id="' +pkid+ '" data-isort="'+nsort+'">';
//    //        rowtable += '<i class="glyphicon glyphicon-pencil"></i> แก้ไข</button>';
//    //        rowtable += '<button class="btn btn-xs btn-danger button_custom btnxDelete" ';
//    //        rowtable += 'id=x'+pkid+' >'; //onclick="delete_tbl('+"'"+pkid+"'"+')"
//    //        rowtable += '<i class="glyphicon glyphicon-trash"></i> ลบ</button>';
//        rowtable += '</td>';
//        rowtable += '</tr>';
//    };        
//     return rowtable;
//    //$('#mytbody').html(rowtable);
//}
//      
//===============================================//
//
//function delete_tbl(tblid){
//    nid = tblid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
//    ch_tr = $('[id="'+nid+'"]').parent().parent();
//    ch_tr.css("background-color","red");
//    if (confirm("ยืนยันการลบ...?") == true){
//        ch_tr.slideUp("slow");
//    }
//    
//    
//}
 
/**
 * Create Serch box html
 * @returns {String}
 */
function searchbox(){
//    var bsearch = '<div class="row toolbar"><div class="pull-right">' +
//                '<div class="input-group">' +
//                '<input class="form-control" type="text" name="search" placeholder="Search" >' +
//                '<span class="input-group-btn">' +
//                    '<button class="btn btn-default glyphicon glyphicon-search" id="search"  type="button"></button>' +
//                '</span>' +  //onclick="search()"
//                '</div><!-- /input-group -->' +
//              '</div>  <!-- /.col-lg-6 -->' +
//              '</div> <!--//class="toolbar" ';
      
    var bsearch = '';
    bsearch += '<div class="row toolbar">';
    //btn search
    bsearch += '<div class="pull-right">';
    bsearch += '<div  class="btn btn-default glyphicon glyphicon-search" id="search"></div>';
    bsearch += '</div>  <!-- // class="pull-right"  -->';  
    //show text search
    bsearch += '<div class="col-md-8 pull-right none">';
    bsearch += '<div id="txt_search" class="well well-sm">';
    bsearch += '</div><!-- //end class=well well-sm -->';
    bsearch += '</div><!-- //end class=col-md-1 pull-right -->';
    bsearch += '</div>  <!-- // class="toolbar"  -->'; 
    return bsearch;
    
}

/**
 * 
 * @returns {undefined}
 */
function create_modal(iden,actions){
    var iden_para = iden+'_'+actions;
    //console.log(iden_para);
    var x = 4;
    var btn_name1 = '', btn_name2 = '', dt_row ='';
    var c_modal= '',
        modal_top='',
        modal_head = '',
        modal_body = '',
        modal_foot = '',
        modal_end = '';
    var i = 0;
    var xcol_length = 0;
    
    if (actions =='search')
    {
        btn_name1 = 'ค้นหา';
    } else {
        btn_name1 = 'บันทึก';
        dt_row =  'data-row = "0"';
    }
    
    modal_top = '<div class="modal fade" id="modal_' + iden_para + '" '+dt_row+' role="dialog">'+
                    '<div class="modal-dialog"  style="width:1000px">'+
                        '<div class="modal-content">';
    modal_end = '</div><!-- /.modal-content -->' +
                '</div><!-- /.modal-dialog -->'+ 
                '</div><!-- /.modal -->';
    modal_head = '<div class="modal-header">' +
                        '<h3 align="center" id="modal_title_'+iden_para+'">'+iden_para+'</h3>'+
                    '</div>';

    modal_foot = '<div class="modal-footer">'+
                        '<button type="button" id="btn_'+iden_para+'" '+    //onclick="ajax_save()"
                            'class="btn btn-primary">'+btn_name1+'</button>'+
                        '<button type="button" id="btn_'+iden+'_cancel" '+  //onclick="clear_modal()"
                            'class="btn btn-danger" data-dismiss="modal">ยกเลิก</button>'+
                    '</div>';
    //xcol_length = xcolumn.length;
    var xcol = xcolumn;
    //console.log(xcolumn.length);
    modal_body = '<div class="modal-body form">' +
                    '<form action="#" id="form_'+iden_para+'"  class="form-horizontal">' +
                        '<div class="form-body">'+
                            '<div class="form-group">'+
                                create_modal_body(actions) +
                            '</div>'
                        '</div>' +
                    '</form>' +
                 '</div>';
                            
    c_modal = modal_top + modal_head +modal_body+ modal_foot + modal_end;
    $('body').after(c_modal);
    
}

/**
 * Create Modal Body
 * @param {type} iden
 * 
 * 
 */
function create_modal_body(actions){
    var box = '';
    var xcol_length = xcolumn.length;
    var m_name = '';
    var m_place = '';
    var m_type = '';
    var m_find = '';
    var m_pk ='';
    
    for (i=0; i < xcol_length; i++ ){
        m_name = xcolumn[i].field;
        m_place = xcolumn[i].placehold;
        m_type = xcolumn[i].datatype;
        m_find = xcolumn[i].find;
        
        if (m_type == 'yes_no'){
            m_type = "checkbox"; 
        }
        //console.log(m_name+'  mtype = '+ m_type);
        
        if (m_find != 'yes' && actions == 'search'){
            //box +="";
            continue;
        }
        
        m_disable = xcolumn[i].type;
        if (m_disable == 'pk' && actions == 'edit') {
            m_disable = 'readonly';
            m_pk = "data-pk='pk'";
        }else{
            m_disable = '';
            m_pk = '';
        }
        
            box += '<label class="control-label col-md-2">'+m_name+'</label>'+
            '<div class="col-md-4">'+
                '<input name="'+m_name+'" placeholder="'+m_place+'" ' +
                    'class="form-control" type="'+m_type+'" '+ m_disable +' '+
                ' '+m_pk+'>' +
            '</div>';
        


    }
    return box;
}



/**
 * Create Search click event
 * 
 */
function search_click(iden,actions){
    $('#search').click(function(){
        //console.log(xcolumn);
        //console.log(iden);
        //alert("search ja");
        //show create_search_modal()
        $('#modal_'+iden+'_'+actions).modal('show');
    })
} 


/**
 * function change_sort()
 * @returns {array}
 * 
 */
function change_sort(){
    var chng_sentdata = sentdata;
    var lngdata = chng_sentdata.morder.length;
    var i = 0;
    var order = '';
    for (i = 0; i < lngdata; i++){
        ar_order = chng_sentdata.morder[i];
        if (ar_order.col == 'BulkID'){ 
            
            ar_order.ord = 'DESC';
        }
    }
    
}

/**
 * Create Add button 
 * 
 */
function create_add_button(){
    var add_btn = '<div class="col-md-1"> ' +
                    '<button type="button" class="btn btn-md btn-success" id="add" > ' +
                    '<i class="glyphicon glyphicon-plus"></i> ' +
                    'เพิ่ม </button>' +
                  '</div>';
    return add_btn;
};

/**
 * Create pagination
 * 
 */


function pagination(active_page){
    //var purl = url;
    var first_link = '&lsaquo; First';
    var last_link = 'Last &rsaquo;';
    var next_link = '&raquo;';
    var prev_link = '&laquo;';
    var pactive = parseInt(active_page);
     //alert(pactive);
    var pmax = parseInt(6);
    var row= 0, total = 10;
    if (typeof r_datas == 'undefined'){
        row = 1;
        total = 1;
    }else{
        row = r_datas.row;
        total = r_datas.total;
    }
    var pnumbrows = parseInt(row); //datas.row from global variable
    var ptotal = parseInt(total);   //datas.total from global variable
    var pnumbpages = Math.ceil(ptotal/pnumbrows);  //number of pages
    //console.log('row= '+pnumbrows+'  total= '+ptotal+' no.pages= '+pnumbpages)
    var paginate ='<ul class="pagination">';
    var    i=1;
    var    prev_numb = 1;
    var    next_numb = 2;
        
//data-page is custom data to store number of page
    function first_tag(prev_numb){
        
//        first_tag = '<li><a onclick=go_to_page(1)>'+first_link+'</li><li>' + 
//                '<a onclick=go_to_page('+prev_numb+')>'+prev_link+'</li>';
        var first_tags = '<li><a class="pg-first" data-page=1>'+first_link+'</li><li>' + 
                '<a data-page = '+prev_numb+'>'+prev_link+'</li>';
        return first_tags;
    };
    
    function end_tag(next_numb){
//        end_tag = '<li><a onclick=go_to_page('+next_numb+')>'+next_link+'</li><li>'+
//                  '<a onclick=go_to_page('+pnumbpages+')>'+last_link+'</li>';
        var end_tags = '<li><a data-page='+next_numb+'>'+next_link+'</li><li>'+
                  '<a data-page='+pnumbpages+'>'+last_link+'</li>';
        return end_tags;
    };
    var start_items = 1;
    var first_items = '';
    var end_items = '';
    var items = 0;
    var oo = 0;
    
    if (pactive == 1 ){
        //paginate += '<li>'+first_link + '</li>';
        first_items = '';
        if ( pmax < pnumbpages ){
            items = pmax;
            end_items  = end_tag(pactive + 1);
        }else if (pactive == pnumbpages){
            items = pnumbpages + 1;
            end_items ='';
        }else{
            items = pnumbpages+1;
            //end_items = '';
            //end_items = '<li><a data-page='+(pnumbpages)+'>'+pnumbpages+'</li>';
            end_items = '<li><a data-page='+(pactive+1)+'>' + 
                        next_link + '</li>';
        }
        
        //items = pmax;
        
        oo =1;
    }else if (pactive > 1 && pactive <= 6 ) {
//        first_items = '<li><a onclick=go_to_page('+(pactive-1)+')>' +
//                prev_link+'</li>';
        first_items = '<li><a data-page='+(pactive-1)+'>' +
                prev_link+'</li>';
        var max_active = pmax + pactive;
            if ( max_active < pnumbpages ){
                items = max_active;
                end_items = end_tag(pactive+1);
            }else if(pactive == pnumbpages ){
                items = pnumbpages+1;
                end_items ='';
            //}else if(max_active > pnumbpages ){
            }else{
                items = pnumbpages+1;
                end_items = '<li><a data-page='+(pactive+1)+'>' + 
                            next_link + '</li>';
            }
        //items = pmax + pactive;
        //console.log(pactive);
        oo =2;
    }else if (pactive > 6 && pactive <= pnumbpages - 6 ) {
        first_items = first_tag(pactive - 1);
        start_items = pactive - 5;
        items = pmax + pactive;
        end_items = end_tag(pactive+1);
        oo =3;
    }else if (pactive > pnumbpages-6 && pactive < pnumbpages) {
        first_items = first_tag(pactive-1);
        start_items = pactive - 6;
        items = pnumbpages+1;
//        end_items = '<li><a onclick=go_to_page('+(pactive+1)+')>' + 
//                next_link + '</li>';
        end_items = '<li><a data-page='+(pactive+1)+'>' + 
                next_link + '</li>';
        oo =4;
    }else if (pactive == pnumbpages) {
        first_items = first_tag(pactive-1);
        start_items = pactive - 6;
        items = pnumbpages+1;
        end_items = '';
        end_numb = ptotal;
        oo =5;
    }
 
    //console.log('p active= '+ pactive + '   items= '+items+ '  oo= '+oo);
    //console.log('oo= '+oo + ' pnumbpages='+pnumbpages+' startitems='+
    //        start_items+ '\n items='+items+ ' enditems='+ end_items);
    //console.log('items = '+ items + ' ptotal='+ ptotal);
    //console.log('end items='+ end_items);
    //console.log(first_items + ' ,'+ start_items + ' ,'+ items+' ,'+ end_items);
    paginate = '<ul class="pagination col-md-9">'+ first_items;
    var i = 0; 
    for (i = start_items; i < items ; i++ ){ 
       //console.log('i='+i +' start_items'+start_items+ 'items='+ items);
        paginate += '<li';
        if (i == pactive) {
            paginate += ' class="active"';
        }
        //paginate += '><a onclick=go_to_page('+i+')>'+i+'</li>';
        paginate += '><a data-page='+i+'>'+i+'</li>';      
    };
        paginate += end_items;
        paginate += '</ul>';

    //create pagination by html page
    
    //add total record and no. of pages
    var summary = '';
        summary += '<ul class="list-group col-md-3 text-center"><li class="list-group-item">หน้า  '+pactive+ '  ของ  '+pnumbpages+"   ";
        summary += '   จากทั้งหมด  '+ptotal+'  รายการ</li></ul>';
        summary +='';
    $('#paginator').html(paginate);
    $('#summary').html(summary);
    //binding event by on or bind or live
        $('li a').on('click',function(){   //bind, live
            //var pagenumb = $(this).text();
            //จับเวลา ดึงข้อมูลด้วย ajax
            var begin = Date.now();
            console.time('paging');
            
            var pagenumb = $(this).attr("data-page");
            //console.log(pagenumb);
            pagination(pagenumb);
            var ajaxurl = surl;
            
            sentdata.begin = pagenumb;
            //update set_sessionstorage();
            //sessionStorage.setItem('begin', pagenumb);
//            var js_sentdata = JSON.stringify(sentdata);
//            sessionStorage.setItem('sess_data', js_sentdata);
            set_sessionstorage();
           // sentdata.morder.push({col:'BulkID',ord:'ASC'});
            
            //console.log('on fn pagination');
            //console.log(sentdata.morder);
            //console.log('ajaxurl ='+ajaxurl+ ' ;sentdata'+JSON.stringify(sentdata));
            var ajx_url = {'r': ajaxurl};
            ajaxload(ajx_url,sentdata);
            hide_show_table();
            //var blank_table = create_table();
            
            
//stop             rowtable = append_table();

           // $('#mytable').find('tbody').html(rowtable);
            //$('#mytable').find('tbody').children('tr').hide();
            //$('#mytable').find('tbody').children('tr').remove();
            //$('#mytable').find('tbody').append(blank_table);
//stop            $('#mytable').find('tbody').append(rowtable);
           // var blank_table = create_table(r_datas);
           
           //check table then delete or add table

           // $(attr_select+obj_select).find('tbody').html(blank_table);
            add_data_table(r_datas);
            
            var end = Date.now();
            console.timeEnd('paging');
            var timespeed = (end-begin)/1000;
            $('strong').text(timespeed);
            btn_delete_edit();
        });
};

function set_sessionstorage(){
    var js_sentdata = JSON.stringify(sentdata);
    sessionStorage.setItem('sess_data', js_sentdata);
}

/**
 * Delete smooth row table 
 * 
 */
function btn_delete_edit(){
//    $('.Delete').click(function(){
//        //alert('click delete');
//        $(this).closest('tr').css("background-color","red");
//        if (confirm("ยืนยันการลบ...?") == true){
//        //$(this).css("background-color","red");
//        $(this).closest('tr')
//                    .children('td')
//                    .animate({padding:0})
//                    .wrapInner('<div />')
//                    .children()
//                    .slideUp(function() {$(this).closest('tr').remove(); });
//        };
//        
//        //$.fn.mytable.ccc(surl,sentdata);
//    });
    
    // new click delete on btnxDelete
    $('.btnxDelete').on("click",function(){
        //delete animate html
        
        var del_data={};
        var del_id = $(this).closest('tr').children('td:first').text();
            //console.log('id'+ del_id);
            //del_id = del_id.substring(1,del_id.length);
        var del_url = durl;
        //var old_color = $(this).closest('tr').css("background-color");
        //$(this).closest('tr').css("background-color","red");
        if (confirm("ยืนยันการลบ...?") == true) {
            $(this).closest('tr').css("background-color","red");
            $(this).closest('tr')
                    .children('td')
                    .animate({padding:0})
                    .wrapInner('<div />')
                    .children()
                    .slideUp(800, function() {$(this).closest('tr').remove();});

        //find field of pk
        var bid = xcolumn;
        var j = 0;
        var fld = '';
            for (j=0; j < bid.length; j++) {
                if (bid[j].type == 'pk') {
                    fld = bid[j].field;
                    //console.log(fld);
                }
            }
        del_data[fld] = del_id;
        var ajax_url = {'d':durl};
        //ajaxload for delete
        console.log('before delete ')
        console.log('repeat z= '+z);
        ajaxload(ajax_url,del_data);
        
        
        } else { //ยกเลิกการลบ
            //$(this).closest('tr').css("background-color","white");
            //$("table tr:nth-child(even)").addClass("striped");
        }
        

        
        //delete by ajax on database
        //alert("OK, delete done already!! by delete_url= " + del_url +
        //      "  del_id = "+ del_id ) ;
       
       
       console.log(durl + '  '+ JSON.stringify(del_data));
       
       //alert(JSON.stringify(del_data) + ' delurl=' + del_url);
     //   ajaxload(ajxurl,del_data);
    });
    
    //new click edite on btnxEdit
    $('.btnxEdit').on("click", function(){
        //var xx = $(this).attr("class");
        //var edit_url = uurl;
        //var del_id = $(this).attr('id');
        //alert('uurl= ' + edit_url+ '  delid= '+ del_id);
        
        //console.log(del_id);
        //console.log(attr_select + obj_select);
        var isrt = $(this).attr("data-isort");
        console.log('isrt= ' + isrt);
        var xdata =r_datas;
        var srt = 0;
            srt = isrt - ((xdata.begin - 1)*xdata.row);
        console.log('begin= '+xdata.begin+' row= ' +xdata.row+ ' srt= ' + srt);
        var change_data = xdata.data[srt];
        //console.log('isort = '+srt);
        console.log('edit data = ');
        console.log(change_data);
        change_data_modal(change_data);
        
        
        var attr_sl = attr_select;
        var obj_sl  = obj_select;
        var obj_selector = $( attr_sl +"modal_"+ obj_sl + "_edit");
        var new_row = $(this).closest('tr').attr('id');
            obj_selector.attr('data-row',new_row);
        $(attr_sl + "modal_title_" +obj_sl + "_edit").text("แก้ไขข้อมูล");
       //console.log('xx= '+rr);
       //uurl is update url
       if (obj_selector.attr('data-add-html')) {
           //console.log('data-add-html is exist');
           obj_selector.removeAttr('data-add-html');
       }
           obj_selector.attr('data-edit-html',uurl);
       
       obj_selector.find('[data-pk="pk"]').prop('readonly',true);
       //$( attr_sl +"modal_"+ obj_sl + "_edit").modal('show');
       
       obj_selector.modal('show');
    });
    
    //create event on click at btnxDetails
//    $('.btnxDetails').on('click',function(){
//       //blk = $(this).closest('tr').find('td:first').text();
//       blk = $(this).closest('tr').attr('id');
//       console.log("btnxDetail click! has id= " + blk);
//       //show_details();
//    });
//    
    
};

function change_data_modal(data_para){
    var attr_sl = attr_select;
    var obj_sl  = obj_select;
    var vals;
    var xvals;
    //var xdata;
    //ไม่มี parameter ส่งมา ให้เป็น add ข้อมูล
    if (data_para == null ) {
        xvals = 0;
        console.log('data para is null');
    } else {  //มี parameter ส่งมา ให้เป็น แก้ไขข้อมูล ข้อมูล
        xdata = data_para;
        //isrt ค่าลำดับ (isort) ใน pagination
        //var isrt = $(this).attr("data-isort");
        //var isrt = srt_para;
        //var xdata =r_datas;
        //srt คำนวน index ใน r_datas.data 

       // console.log('srt= ' + srt);
    }
    //ค่า xcolumn ระบุหัวตาราง
    var bid = xcolumn;
    var fld='', type='';
    var j= 0;
    var lng = bid.length;
    var istrue;
       //วนลูปใส่ จาก r_datas.data ลงในตารางตามการตั้งค่าใน xcolumn
    var obj_change = $(attr_sl + "modal_"+obj_sl+"_edit");
    
    //if ( xvals !== '' ){
        for (j=0; j< lng ; j++ ) {
            fld = [bid[j]['field']];
            type = [bid[j]['type']];
            if ( xvals == 0) {
                vals = '';
            }else{
                vals = xdata[bid[j]['field']];
            }
            if ( type == "checked" ){ // type = checked
                if ( vals == '0'){ // 0 == false 
                    
                    istrue = false;
                }else{  // 1 ==  true
                    istrue = true;
                }
                obj_change.find('[name="'+fld+'"]').prop('checked',istrue) ;
            }else{
                obj_change.find('[name="'+fld+'"]').val(vals);
            }
           //console.log('srt ='+ srt);
          // if ( vals == '' ) {
          //     vals = '';
           //} else {
               //vals = xdata.data[srt][bid[j]['field']];

            //console.log('modal is  '+ bid[j]['field'] + '  =  ' + vals);
           //}
            //$(attr_sl+"modal_"+obj_sl+"_edit").find('[name="'+fld+'"]').val(vals);
        }
    //}
}



//function go_to_page(pagenumb){
//   pagination(pagenumb);
//   //alert('pagenumb='+ pagenumb);
//    var ajaxurl = surl;
//    sentdata.begin = pagenumb;
//    //var sdata = sentdata;
//    //console.log('ajaxurl ='+ajaxurl+ ' ;sentdata'+JSON.stringify(sentdata));
//    ajaxload(ajaxurl,sentdata);
//    rowtable = append_table();
//    ox = $.fn.mtable.obj.html();
//    alert(ox);
//    $('#mytable').find('tbody').html(rowtable);
//};
function get_val_modal(action_crud){//create read update delete
    var j = 0;
    var bid = xcolumn;
    var act = '';
        if ( action_crud == 'r') {
            act = '_search';
        }else{
            act = '_edit';
        }
    var fld_select = $(attr_select + 'modal_' + obj_select + act);
    var fld = '', type='', find = '';
    var vals ;
    var c_r_u = {}; //array data of insert of update
    
//    if ( action_crud == 'r') { // for search only
//        
//    } else { // for edit and create/add
//        
//    }
    for (j = 0; j < bid.length; j++ ) {
        fld = [bid[j]['field']];
        type = [bid[j]['type']];
        find = [bid[j]['find']];
        //console.log('type ' + type);
        if ( find != 'yes' && action_crud == 'r') {
          continue;  
        }
            if ( type =="checked" ) {
                //console.log('type checked');
                vals = fld_select.find('[name="'+fld+'"]').prop('checked');
                //console.log('type checked ' + vals);
                if ( vals ){ //is true
                    vals = '1';
                    //console.log('check '+ vals);
                }else{
                    vals = '0';
                }
            }
            else
            {
                vals = fld_select.find('[name="'+fld+'"]').val();
                
            }
        
        console.log('field= '+fld+ '  value= '+vals);
            if ( vals !== '') {
                c_r_u[fld] = vals;
            }
    }
    return c_r_u;
}

function save(){
//  if ( xvalid ){
//    console.log('xvalid = true');
    var btn_save= $("#btn_" +obj_select+"_edit");
    var fld_select = $(attr_select+'modal_'+obj_select+'_edit');
    //jj = btn_save.attr('type');
    var c_u = {}; //array data of insert of update
//    var j = 0;
//    var bid = xcolumn;
//    var fld = '', type='';
//    var vals ;
    var edit_url = '';
    var action =''; // c=create or insert , r=read , u=update , d=delete
    var sent_url = {}; //sent url {crud:url}
    //var obj_selector = $()
    btn_save.click(function(){
    var form = $(attr_select+'form_' +obj_select+'_edit');
        xvalid = form.valid();
        //alert('valid is ' + xvalid);
    
    
    //alert('add');
    //เก็บข้อมูลที่ต้องการจะแก้ไข ลงในตัวแปรarray : c_u[]
    //
//======= this code change to function get_val_modal() ==========//
//    for (j = 0; j < bid.length; j++ ) {
//        fld = [bid[j]['field']];
//        type = [bid[j]['type']];
//        //console.log('type ' + type);
//        if ( type =="checked" ) {
//            //console.log('type checked');
//            vals = fld_select.find('[name="'+fld+'"]').prop('checked');
//            //console.log('type checked ' + vals);
//            if ( vals ){ //is true
//                vals = '1';
//                //console.log('check '+ vals);
//            }else{
//                vals = '0';
//            }
//        }
//        else
//        {
//            vals = fld_select.find('[name="'+fld+'"]').val();
//        }
//        c_u[fld] = vals;
//    }
    //console.log('col up is -> ');
    c_u = get_val_modal('cu');  //cu as c=create, u=update
    
    console.log(c_u);
    
    //check modal for add or edit
    if (fld_select.attr('data-add-html')){
       action = 'c';
       edit_url = fld_select.attr('data-add-html');
       sentdata.begin = 1;
       sessionStorage.setItem('sess_data',JSON.stringify(sentdata));
       pagination(1);
    }else if(fld_select.attr('data-edit-html')){
       action = 'u';
       edit_url = fld_select.attr('data-edit-html');
    }
    sent_url[action] = edit_url;
    c_u['action'] = action;
    //console.log('Edit Url = '+ edit_url);
    console.log(sent_url);
    //
    
    //ajaxload(sent_url,sent_data);
//console.log(xvalid);
    if (xvalid){
        console.log('xvalid = true');
        ajaxload(sent_url,c_u);
        $(attr_select+'modal_'+obj_select+'_edit').modal('hide');
    }else{
        console.log('xvalid = false');
    }
    
    });
      
    //  console.log('jj= ' + jj);
//  }else{  //xvalid == false
//      console.log('xvalid = false');
//  }
}

//    }; // End of fn.mtable

function hide_row_table(){
    var j = 0;
    $('.myrow.none').each(function(){
        j += 1;
    });
    
    return j;
}


function count_row_table(){
    var i = 0;
    $('.myrow').each(function(k,v){
        i += 1;
    });
    
    return i;
}

 })(jQuery);



$(document).ready(function() {  

/**
 * Change style sheet css on hearder by javascript
 * 
 */

    var sty = $("style");
    sty.append("*{ font-size: 12px} \n" + 
            ".button_custom { " +
            "width:58px;} \n" +
            "th {text-align:center} \n" +
            ""
    );



});


   