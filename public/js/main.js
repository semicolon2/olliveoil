var year = new Date().getFullYear();
var copyright = new Vue({
    el: '#copyright',
    data: {copyrightText: "Copyright © "+year+" Olivia Giesbrecht"}
});

const currentRoute = window.location.pathname;
const baseUrl = window.location.hostname;

switch(currentRoute){
    case '/':
        var home = new Vue({
            el: '#home',
            data: {
                homeImage: 'http://www.placekitten.com/600/600'
            }
        });
        break;
    case '/gallery':
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
                    this.$http.get('/galleryItems/Traditional').then((response)=>{
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
        break;
    case '/login':
        var admin = new Vue({
            el: '#admin',
            data: {username: "", password: "", errorMessage: ""},
            methods: {
                submitLogin: function(username, password){
                    this.$http.post('/login', {username: username, password: password}).then((response)=>{
                        window.location.href = '/admin';
                    },(response)=>{
                        console.log(response.status);
                        if(response.status == (401)){
                            this.errorMessage = "Incorrect username or password!";
                        } else if (response.status == 500){
                            this.errorMessage = "Server error, try again.";
                        }
                    });
                },
                resetAdmin: function(){
                    this.$http.get('/resetAdmin').then((response)=>{
                        console.log(response.status);
                    },(response)=>{
                        console.log(response.status);
                    });
                }
            }
        });
        break;
}
