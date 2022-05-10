$(".upload").click(function () {
  const collectionTitle = $(this).parents(".col-4").find(".row").text();
  // console.log(collectionTitle);
  $(".work_belong_collection").val(collectionTitle);
});

$("#workpreview").hide();
$("#preview").hide();
function previewFile() {
  var preview = document.querySelector("img");
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      preview.src = reader.result;
    },
    false
  );
  if (file) {
    reader.readAsDataURL(file);
    $('label[for="imageupload"]').hide();
    $("#icon").hide();
    $("#notice").hide();
    $("#preview").show();
  }
}
function previewwork() {
  var preview = document.querySelector("#workpreview");
  var file = document.querySelector("#workimageupload").files[0];
  var reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      preview.src = reader.result;
    },
    false
  );
  if (file) {
    reader.readAsDataURL(file);
    $('label[for="workimageupload"]').hide();
    $("#workpreview").show();
    $("#workicon").hide();
    $("#worknotice").hide();
  }
}
const ipfs = window.IpfsHttpClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});
$("#imageupload").on("change", function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    const magic_array_buffer_converted_to_buffer = buffer.Buffer(reader.result); // honestly as a web developer I do not fully appreciate the difference between buffer and arrayBuffer
    ipfs.add(magic_array_buffer_converted_to_buffer, (err, result) => {
      console.log(err, result);

      //let link = "<a href='https://gateway.ipfs.io/ipfs/" + result[0].hash>'</a>;
      let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
      //document.getElementById("link").innerHTML = link
      console.log(ipfsLink);
      $("#ipfsuri").val(ipfsLink);
    });
  };
  reader.readAsArrayBuffer(this.files[0]);
});
$("#workimageupload").on("change", function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    const magic_array_buffer_converted_to_buffer = buffer.Buffer(reader.result); // honestly as a web developer I do not fully appreciate the difference between buffer and arrayBuffer
    ipfs.add(magic_array_buffer_converted_to_buffer, (err, result) => {
      console.log(err, result);

      //let link = "<a href='https://gateway.ipfs.io/ipfs/" + result[0].hash>'</a>;
      let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
      //document.getElementById("link").innerHTML = link
      console.log(ipfsLink);
      $("#work_ipfsuri").val(ipfsLink);
    });
  };
  reader.readAsArrayBuffer(this.files[0]);
});
