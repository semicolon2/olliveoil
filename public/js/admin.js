var year = new Date().getFullYear();
var copyright = new Vue({
    el: '#copyright',
    data: {copyrightText: "Copyright © "+year+" Olivia Giesbrecht"}
});

var admin = new Vue({
    el: '#admin',
    data: {galleryOption: "Traditional", imageName: "", errorMessage: "", galleryItems: []},
    methods: {
        logout: function(){
            this.$http.get('/logout').then(()=>{
                window.location.href = '/login';
            });
        },
        onSubmit: function(gallery, name){
            var fileInput = $('#file-input')[0];
            if(!fileInput.files[0]){
                this.errorMessage = "No file chosen!";
            } else {
                this.errorMessage = "";
                var formData = new FormData();
                formData.append('gallery', gallery);
                formData.append('name', name)
                formData.append('fileInput', fileInput.files[0]);
                this.$http.post('/upload', formData, {headers: {'content-type':'multipart/form-data; boundary=XXXXXXXX'}}).then((response)=>{
                    if(response.body.gallery == this.galleryOption){
                        this.galleryItems.push(response.body);
                    }
                });
            }
        },
        updateGallery: function(gallery){
            this.galleryItems = [];
            this.$http.get('/galleryItems/'+gallery).then((response)=>{
                this.galleryItems = response.body;
            });
        },
        onRemove: function(item, index){
            this.$http.delete('/delete/'+item._id).then(()=>{
                this.galleryItems.splice(index, 1);
            });
        }
    }
});
admin.updateGallery('Traditional');
