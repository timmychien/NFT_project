function previewFile() {
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);
    if (file) {
        reader.readAsDataURL(file);
    }
}
$('#upload').click(function(){
    var formData = new FormData();
    var imagefile = document.querySelector('#image');
    formData.append("image", imagefile.files[0]);
    axios.post('../../routes/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
})