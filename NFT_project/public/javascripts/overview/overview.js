$(document).ready(function(){
    $('#signup').click(function(){
        //var index=$(this).index('.container');
        var topic=$('input#topic').val();
        //var index = $('.container').index(this);
        //var index = $(this).index();
        //var topic = $('input#topic').eq(index).val();
        window.location.href = "/signup/"+topic;
    });
    $('#vote').click(function(){
        var topic = $('input#topic').val();
        //var index = $(this).index(selector);
        //var index = $('#container').index();
        //var index = $('#container').index();
        //var topic = $('input#topic').eq(index).val();
        window.location.href = "/vote/" + topic;
    })
})
/*
function signup(){
    var index=$('#container').index(this);
    var topic = $('input#topic').eq(index).val();
    window.location.href = "/signup/" + topic;
}
function vote(){
    var index = $('#container').index(this);
    var topic = $('input#topic').eq(index).val();
    window.location.href = "/vote/" + topic;
}

function GetIndex(sender) {
    var container = document.getElementsByClassName('container');
    var containerLen = container.length;
    var index;
    for (var i = 0; i < containerLen; i++) {
        if (container[i] == sender) //this condition is never true
        {
            index = i;
            return index;
        }
    }
}*/