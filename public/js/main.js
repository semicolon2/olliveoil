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
        var gallery = new Vue({
            el: '#gallery',
            data: {
                items: [
                    {src: 'http://placekitten.com/200/300', title: 'kitten one'},
                    {src: 'http://placekitten.com/200/350', title: 'kitten two'},
                    {src: 'http://placekitten.com/200/150', title: 'kitten three'},
                    {src: 'http://placekitten.com/200/200', title: 'kitten four'},
                    {src: 'http://placekitten.com/200/225', title: 'kitten five'},
                    {src: 'http://placekitten.com/200/300', title: 'kitten 6'},
                    {src: 'http://placekitten.com/200/350', title: 'kitten 7'},
                    {src: 'http://placekitten.com/200/150', title: 'kitten 8'},
                    {src: 'http://placekitten.com/200/200', title: 'kitten 9'},
                    {src: 'http://placekitten.com/200/300', title: 'kitten 10'},
                    {src: 'http://placekitten.com/200/350', title: 'kitten 11'},
                    {src: 'http://placekitten.com/200/150', title: 'kitten 12'},
                    {src: 'http://placekitten.com/200/200', title: 'kitten 13'},
                    {src: 'http://placekitten.com/200/300', title: 'kitten 14'},
                    {src: 'http://placekitten.com/200/350', title: 'kitten 15'},
                    {src: 'http://placekitten.com/200/150', title: 'kitten 16'},
                    {src: 'http://placekitten.com/200/200', title: 'kitten 17'},
                    {src: 'http://placekitten.com/200/200', title: 'kitten 18'}

                ]
            }
        });
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
