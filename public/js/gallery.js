lightbox.option({
    alwaysShowNavOnTouchDevices: true,
    fadeDuration: 400,
    imageFadeDuration: 400,
    resizeDuration: 300
});
var gallery = new Vue({
    el: '#gallery',
    data: { galleryItems: [], page: 1, isPreviousDisabled: true, isNextDisabled: false },
    methods: {
        updateGallery: function(){
            this.galleryItems = [];
            this.$http.get('/galleryItems/'+this.galleryOption).then((response)=>{
                this.galleryItems = response.body;
            });
        },
        galleryPage: function(page){
            return this.galleryItems.slice( ((page-1)*18), (page*18) );
        }
    },
    computed: {
        pageCount: function() {
            return Math.ceil(this.galleryItems.length/18);
        },
        galleryOption: function() {
            return $("#gallery-option").val();
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
gallery.updateGallery();
