var express=require('express');
var app=express();
var request=require('request-promise');
var mongoose=require('mongoose');
var bodyparser=require('body-parser');
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost/weathers");
app.use(bodyparser.urlencoded({useNewUrlParser: true}));



var citySchema=new mongoose.Schema({
     name:String
});

var citymodel =mongoose.model('city',citySchema);
//var delhi=citymodel({name:'delhi'});
//delhi.save();

async function getweather(cities){
  var weather_data=[];

    for(var city_obj of cities){
        var city=city_obj.name;
        var url=`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=271d1234d3f497eed5b1d80a07b3fcd1`;
        
      var response_body=  await request(url);
      var weather_JSON =  JSON.parse(response_body);

      var   weather = {
        city:city,
        temp:Math.round((weather_JSON.main.temp -32) * 5 / 9),
        description:weather_JSON.weather[0].description,
        icon:weather_JSON.weather[0].icon
    };
    weather_data.push(weather);

}

    return weather_data;
 
    
    
}
 
 
    





app.get('/',function(req,res){
    citymodel.find({},function(err,cities){
        getweather(cities).then(function(results){

          console.log(cities);
          
          var weather_data={weather_data:results};

    res.render('weather',weather_data);
       
        });
 
    
 
      
      
    });


});
    

app.post('/',function(req,res){
    
    var newCity=new citymodel({name: req.body.city_name});

    newCity.save();
    res.redirect('/');


});


app.listen(90,function(req,res){
    console.log("its working");
});