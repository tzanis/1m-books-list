var myApp = angular.module('booksApp', ['ionic']);

myApp.controller('MainCtrl', ['$timeout', function($timeout) {

  this.isLoading = false;
  this.generatingList = true;
  this.orderBy = '';
  this.direction = '';

  var self = this;

  this.setOrder = function(sortOption){
    self.isLoading = true;
    self.direction = (self.direction == '')?'-':'';
    self.orderBy = self.direction + sortOption;
    self.filteredBooks = _.sortBy(self.books, function(book){ 
      if( sortOption === 'authorName' ){
        return book.author.name; 
      }
      else{
        return book[self.orderBy]; 
      }
    });
    $timeout(function(){
      self.isLoading = false;
    }, 500);
  };

  this.books = [];
  this.filteredBooks = [];

  this.isHalloween = function (dateobj) {
    return (dateobj.date() == 31 && dateobj.month() == 9); // Zero bazed months
  };

  this.filterBooks = function () {

    var filtering = {
      genre: $('#genreFilter').val(),
      authorGender: $('#genderFilter').val()
    };

    $('#loading').show();
    $timeout(function(){
      self.filteredBooks = _.filter(self.books, function(book){ 
        return (filtering.genre === '' || book.genre == filtering.genre) && (filtering.authorGender === '' || book.author.gender == filtering.authorGender);
      });
    }, 200);
    
    $timeout(function(){
      $('#loading').hide();
    }, 500);
    
  };

  this.isLastFridayForMonth = function (dateobj) {
    var lastDay = new moment( dateobj).endOf('month').startOf('day');
    var result = lastDay.endOf('month');
    while (result.day() !== 5) {
        result.subtract(1, 'day');
    }
    return ( dateobj.format('YYYY-M-D') == result.format('YYYY-M-D' ) );
  };

  var randomDate = function (start, end) {
    return new moment( start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  // Init
  
  $timeout(function(){

    var tempGenre = '';

    for (var i = 1; i <= 1000000; i++){ // generate 1M books.

      if( i % 10 === 1 ){
        tempGenre = 'horror'
      }
      else if( i % 10 === 2 ){
        tempGenre = 'finance'
      }else{
        tempGenre = 'Genre #' + (i % 10);
      }

      self.books.push({
        name:   'book '+i,
        author: {name: 'author '+i, gender: ( Math.random() * (29) + 1 > 5 )?'m':'f'}, // Randomly generate autor's gender
        genre: tempGenre,
        publishDate: randomDate(new Date(1990, 0, 1), new Date()) // Randomly generate publishDate
      });


    }

    // Done generating the list
    self.filteredBooks = self.books;
    $('#loading').hide();

  }, 1000);

}]);