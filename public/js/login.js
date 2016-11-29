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
