function exchange(){
    var tochange=$('#tochange').val();
    var needchange=int(tochange*100);
    $('#needchange').text(needchange);
}