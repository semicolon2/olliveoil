var year = new Date().getFullYear();
var copyright = new Vue({
    el: '#copyright',
    data: {copyrightText: "Copyright © "+year+" Olivia Giesbrecht"}
});

var app = new Vue({
    el: '#app',
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
