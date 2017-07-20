
/*
$('.post-pencil').click(function(){
    $('#mask').css('display','block');
    $('#write-post').fadeIn();
});
$('#mask').click(function(){
    $('#mask').hide();
    $('#write-post').hide();

});*/

$('#submit-post').click(function(){

    $('form').on('submit',function(event){
    event.preventDefault();
    $.ajax({
        url:'http://localhost:3000/timeline/post',
        type:'POST',
        data:$(this).serialize(),
        success:function(data){
            //alert('success');
            //$('#submit-post').attr('data-dismiss','modal');
            console.log(data);
            $('#post-success-alert').html('<p>'+ data +'</p>');
            $('#post-success-alert').fadeIn(1000,function(){
                $('#post-success-alert').hide();
            });

        },
        error:function(xhr,status,error){
            console.log('Error:'+ error.message);

        }
    });
        console.log($(this).serialize());
});

});

