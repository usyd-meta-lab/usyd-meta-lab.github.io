function trippleTreat(t){
  do{
  x = jsPsych.randomization.shuffle(t);
  y = [];

  x.forEach(number => {
      if (number % 2 === 0) {
        y.push(x.indexOf(number));
      }
    });

    var results = [];
    var limit   = y.length - 1;

    var sequence = 0;
    for (var i = 0; i < limit; ++i) {
      var diff = y[i+1] - y[i];
      if (sequence && sequence === diff) {
        results.push(i-1);
        continue;
      }
      sequence = (diff === 1 || diff === -1) // or ... Math.abs(diff) === 1
               ? diff
               : 0;
    }
//

z = [];

x.forEach(number => {
if (number % 2 != 0) {
z.push(x.indexOf(number));
}
});


var limit   = z.length - 1;

var sequence = 0;
for (var i = 0; i < limit; ++i) {
var diff = z[i+1] - z[i];
if (sequence && sequence === diff) {
results.push(i-1);
continue;
}
sequence = (diff === 1 || diff === -1) // or ... Math.abs(diff) === 1
     ? diff
     : 0;
}

}
while(results.length > 0)

return x

  }






function yoking(){

searching = 0;
    $.ajax({
      type: "GET",
      url: "Yoking-Database.csv",
      datatype: "text/csv",
      async: false,
      success: function(data){
          var item = data.split("\n");


          $.each(item, function (i, ioo) {
           btn_array = ioo.split(",");


           if(searching == 0 & btn_array[1] == "CR" & (btn_array[2] == "Unassigned" | btn_array[2] == "Unassigned\r" | btn_array[2] == "Unassigned\n" )){ egg = btn_array[0]; btn_array[2] = "Assigned\n"; searching = 1;}
           if(btn_array[2] == "Status\r"){btn_array[2] = "Status\n"}
           if(btn_array[2] == "Status"){btn_array[2] = "Status\n"}
           if(btn_array[2] == "Yoked\r"){btn_array[2] = "Yoked\n"}
           if(btn_array[2] == "Yoked"){btn_array[2] = "Yoked\n"}
           if(btn_array[2] == "Unassigned\r"){btn_array[2] = "Unassigned\n"}
           if(btn_array[2] == "Assigned\r"){btn_array[2] = "Assigned\n"}
           if(btn_array[2] == "Unassigned"){btn_array[2] = "Unassigned\n"}
           if(btn_array[2] == "Assigned"){btn_array[2] = "Assigned\n"}
           if(btn_array[2] == "NA"){btn_array[2] = "NA\n"}
           if(btn_array[2] == "NA\r"){btn_array[2] = "NA\n"}
           new_data.push(btn_array);



            })
      }
    });


  // Hold it on the Database

  new_data = new_data.join("")

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'database-manager.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({filedata: new_data, sessionid: "Yoking-Database"}));


// DOUBLE check to prevent double yoking

double_data = [];
  $.ajax({
    type: "GET",
    url: "Yoked.csv",
    datatype: "text/csv",
    async: false,
    success: function(data){
         double_data = data.split("\n");

    }
  });



  double_data = double_data.map(i => i + '\n');
  double_data = double_data.join("")
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'database-manager.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({filedata: double_data, sessionid: "Yoked"}));



if(double_data.includes(egg)){console.log("DOUBLE YOKED!!!!"); searching = 0; condition = "CR";}
if(double_data.includes(egg)){console.log("DOUBLE YOKED!!!!"); searching = 0; condition = "JOL";}

  if(searching == 0){egg = undefined}
    console.log("Egg:", egg)




}



function yoked(){
  jsPsych.data.addProperties({is_yoked: is_yoked});

  // Get egg

   new_data = [];
  yoking()
  jsPsych.data.addProperties({egg: egg});


  if(egg == undefined){  condition = jsPsych.randomization.sampleWithoutReplacement(['CR', 'JOL'],1);} else {
     condition = jsPsych.randomization.sampleWithoutReplacement(['No-CR'],1);


  $.ajax({
    type: "GET",
    url: "Data/" + egg + ".csv",
    datatype: "text/csv",
    async: false,
    success: function(data){
      result = data;
    }
  });

  const parseResult = Papa.parse(result, { header: true });




  for (let row of parseResult.data) {
    if(row["trial_name"] == "CR" | row["trial_name"] == "JOL"){
    RTs.push(row["rt"]);
      last_cond.push(row["condition"]);
      stim_order.push(row["item_index"]);
  }
  }

   RTs.join("\n");
   last_cond.join("\n");
   stim_order.join("\n");
   last_cond = last_cond[0]

  }
}




function addtoDatabase(x,y){

  added_data = [];
    $.ajax({
      type: "GET",
      url: "Yoking-Database.csv",
      datatype: "text/csv",
      async: false,
      success: function(data){
          var item = data.split("\n");


          $.each(item, function (i, ioo) {
           btn_array = ioo.split(",");

           if(btn_array[2] == "Status\r"){btn_array[2] = "Status\n"}
           if(btn_array[2] == "Status"){btn_array[2] = "Status\n"}
           if(btn_array[2] == "Yoked\r"){btn_array[2] = "Yoked\n"}
           if(btn_array[2] == "Yoked"){btn_array[2] = "Yoked\n"}
           if(btn_array[2] == "Unassigned\r"){btn_array[2] = "Unassigned\n"}
           if(btn_array[2] == "Assigned\r"){btn_array[2] = "Assigned\n"}
           if(btn_array[2] == "Unassigned"){btn_array[2] = "Unassigned\n"}
           if(btn_array[2] == "Assigned"){btn_array[2] = "Assigned\n"}
           if(btn_array[2] == "NA"){btn_array[2] = "NA\n"}
           if(btn_array[2] == "NA\r"){btn_array[2] = "NA\n"}
           added_data.push(btn_array);



            })
      }
    });


    if(y == "CR") {newinfo = [x,y, "Unassigned\n"];} else{newinfo = [x,y, "NA\n"];}

    added_data.splice(added_data.length-1, 0, newinfo);
    added_data = added_data.join("")
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'database-manager.php'); // 'write_data.php' is the path to the php file described above.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({filedata: added_data, sessionid: "Yoking-Database"}));


}

function markComplete(x){

fin_data = [];
  $.ajax({
    type: "GET",
    url: "Yoked.csv",
    datatype: "text/csv",
    async: false,
    success: function(data){
         fin_data = data.split("\n");

    }
  });

  fin_data.push(x)
  fin_data = fin_data.map(i => i.replace(/(\r\n|\n|\r)/gm,""));
  fin_data = fin_data.map(i => i + '\n');
  fin_data = fin_data.join("")
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'database-manager.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({filedata: fin_data, sessionid: "Yoked"}));


}
