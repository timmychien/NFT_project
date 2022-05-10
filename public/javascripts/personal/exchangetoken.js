$("#tochange").on("input", function () {
  var tochange = $("#tochange").val();
  var needchange = tochange * 100;
  if (!$(this).val()) {
    needchange = "";
  }
  $("#todebit").val(needchange);
});