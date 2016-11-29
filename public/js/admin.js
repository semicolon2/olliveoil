var year = new Date().getFullYear();
var copyright = new Vue({
    el: '#copyright',
    data: {copyrightText: "Copyright © "+year+" Olivia Giesbrecht"}
});

var admin = new Vue({
    el: '#admin',
    data: {galleryOption: "Traditional", imageName: "", errorMessage: "", galleryItems: [], uploading: false, croppie: null, page: 1, isPreviousDisabled: true, isNextDisabled: false},
    methods: {
        logout: function(){
            this.$http.get('/logout').then(()=>{
                window.location.href = '/login';
            });
        },
        onSubmit: function(gallery, name){
            var fileInput = $('#file-input')[0];
            if(!name){
                this.errorMessage = "Choose a name!";
            } else {
                this.errorMessage = "";
                this.croppie.result({type:'blob', size:{width: 300, height: 300}}).then((result)=>{
                    var formData = new FormData();
                    formData.append('gallery', gallery);
                    formData.append('name', name);
                    formData.append('thumb', result, "thumb-"+fileInput.files[0].name);
                    formData.append('fileInput', fileInput.files[0]);
                    this.$http.post('/upload', formData, {headers: {'content-type':'multipart/form-data; boundary=XXXXXXXX'}}).then((response)=>{
                        this.croppie.destroy();
                        this.uploading = false;
                        this.galleryItems.push({fileName: response.body.fileName, name: response.body.name});
                    });
                });
            }
        },
        onCroppie: function(e){
            this.uploading = true;
            var fileSrc = URL.createObjectURL(e.target.files[0]);

            this.croppie = new Croppie($('#croppieAnchor')[0], {
                boundary: {width: 500, height: 500},
                viewport: {width: 475, height: 475, type: 'square'}
            });
            this.croppie.bind({url:fileSrc});
        },
        updateGallery: function(gallery){
            this.galleryItems = [];
            this.$http.get('/galleryItems/'+gallery).then((response)=>{
                this.galleryItems = response.body;
            });
        },
        galleryPage: function(page){
            return this.galleryItems.slice( ((page-1)*24), (page*24) );
        },
        onRemove: function(item, index){
            this.$http.delete('/delete/'+item._id).then(()=>{
                this.galleryItems.splice(index, 1);
            });
        }
    },
    computed: {
        pageCount: function() {
            return Math.ceil(this.galleryItems.length/24);
        }
    },
    watch: {
        page: function(){
            if(this.page > 1){
                this.isPreviousDisabled = false;
            } else {
                this.isPreviousDisabled = true;
            }

            if(this.page === this.pageCount){
                this.isNextDisabled = true;
            } else {
                this.isNextDisabled = false;
            }
        }
    }
});
admin.updateGallery('Traditional');
