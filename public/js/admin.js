var year = new Date().getFullYear();
var copyright = new Vue({
    el: '#copyright',
    data: {copyrightText: "Copyright © "+year+" Olivia Giesbrecht"}
});

var admin = new Vue({
    el: '#admin',
    data: {galleryOption: "", errorMessage: ""},
    methods: {
        logout: function(){
            this.$http.get('/logout').then(()=>{
                window.location.href = '/login';
            });
        },
        onSubmit: function(gallery){
            var fileInput = $('#file-input')[0];
            if(!fileInput.files[0]){
                this.errorMessage = "No file chosen!";
            } else {
                this.errorMessage = "";
                var formData = new FormData();
                formData.append('gallery', gallery);
                formData.append('fileInput', fileInput.files[0]);
                this.$http.post('/upload', formData, {headers: {'content-type':'multipart/form-data; boundary=XXXXXXXX'}});
            }
        }
    }
});
