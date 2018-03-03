console.info('first line');
process.env.DEBUG = 'actions-on-google:*';
const {DialogflowApp} = require('actions-on-google');
const functions = require('firebase-functions');
const path = require('path');
const fs = require('fs');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

console.log('test');

exports.monashAssistant = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({request, response});
  console.log('check');
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

    function getFact(app) {
        console.log('here in getfact');
        console.log(__dirname);
        console.log(process.cwd());
        //fs.readdirSync(process.cwd()).forEach(file => {
        //console.log(file);
        //});
        file = path.join(__dirname,'facts.json');
        console.log(file);
        random = Math.floor(Math.random()*46);
        console.log(random);
        fs.readFile(file, 'UTF-8', function (err,contents) {
            console.log("inside read");
            if (err) {
                console.log("error" + err);
            }else {
                data = JSON.parse(contents);
                img = path.join(__dirname,data[random]['img']);
                console.log(img);
                //console.log(data[random]['year']);
                if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {

                    app.ask(app.buildRichResponse()
                    .addSimpleResponse("Here is a fact for you")
                    .addBasicCard(app.buildBasicCard(
                    'in ' + data[random]['year'] + ' ' + data[random]['text']).
                     setImage(data[random]['img'],'Image')
                    .setTitle(data[random]['headline']))
                    .addSuggestions(['More', 'Who is your boss', 'Unit information']));
                }
                else {
                    app.ask('in ' + data[random]['year'] + ' ' + data[random]['text'] );
                }

                }

            });

    }



function getUnitLink(app) {

  let param = app.getSelectedOption();
  console.log("before surface capa");
  if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
    console.log('inside selected text');
    if (!param){
      app.ask("To get more details about the unit say synopsis, to get information about a new unit say unit information");
    }
    else {

      unit = param.split(',')[0];
      selector = param.split(',')[1];

      file = path.join(__dirname,'MIT.json');

      fs.readFile(file, 'UTF-8', function (err,contents) {
        if (err) {
            console.log("error" + err);
        }else {
            data = JSON.parse(contents);
            //console.log(data[random]['year']);
            //unitQueried = app.getArgument('number');
            // unitArray = unitQueried.split(' ');
            // console.log(unitArray[0]);
            // for (var j =0; j<unitArray.length ; j++ ){
            //   unitQueried += unitArray[j];
            // }
            // console.log(unitQueried);
            for (var i = 0 ; i < 1 ; i++) {
              if (data[i]['unitNumber'] === unit) {
                  break;
              }
              i += 1;
            }
          }
        });

      if (selector === 'SEMESTER') {
      app.ask("Semester 1 runs from February to June");
      app.ask("Semester 2 runs from July to November");
    }
      else if (selector === 'PROHIBITIONS') {

        // file = path.join(__dirname,'MIT.json');
        //
        // fs.readFile(file, 'UTF-8', function (err,contents) {
        //   if (err) {
        //       console.log("error" + err);
        //   }else {
        //       data = JSON.parse(contents);
        //       //console.log(data[random]['year']);
        //       //unitQueried = app.getArgument('number');
        //       // unitArray = unitQueried.split(' ');
        //       // console.log(unitArray[0]);
        //       // for (var j =0; j<unitArray.length ; j++ ){
        //       //   unitQueried += unitArray[j];
        //       // }
        //       // console.log(unitQueried);
        //       for (var i = 0 ; i < 1 ; i++) {
        //         if (data[i]['unitNumber'] === unit) {
        //             break;
        //         }
        //         i += 1;
        //       } //for
                if (data[i]['prohibitions'] === 'No units'){
                  app.ask("No prerequesite units");
                }
                else {
                  prohibitionsArray = data[i]['prohibitions'].split(',');
                  app.ask('check this array' + prohibitionsArray[0] + prohibitionsArray[1]+ prohibitionsArray[2]);
                }

            }

      else if (selector === 'COREQUESITE') {
        app.ask("got co");
      }
      else if (selector === 'PREREQUESITE') {
        app.ask("got pre");
      }

}

}
} //function close





    function getUnitDetails(app) {
    //  fs.readdirSync(process.cwd()).forEach(file => {
    //  console.log(file);
    //  });
      file = path.join(__dirname,'MIT.json');

      fs.readFile(file, 'UTF-8', function (err,contents) {
        if (err) {
            console.log("error" + err);
        }else {
            data = JSON.parse(contents);
            //console.log(data[random]['year']);
            unitQueried = app.getArgument('number');
            // unitArray = unitQueried.split(' ');
            // console.log(unitArray[0]);
            // for (var j =0; j<unitArray.length ; j++ ){
            //   unitQueried += unitArray[j];
            // }
            // console.log(unitQueried);
            for (var i = 0 ; i < 1 ; i++) {
              if (data[i]['unitNumber'] === unitQueried) {
                  break;
              }
              i += 1;
            }
            if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {


                app.askWithList('Alright! Here are the details about ' + data[i]['unitNumber'] +
              ' : ' + data[i]['unitName'],
                app.buildList(data[i]['unitNumber'] + ' : ' + data[i]['unitName'])
                .addItems(app.buildOptionItem(data[i]['unitNumber'] + ',SEMESTER',['semester','availability'])
                .setTitle('Semester')
                .setDescription('Available in : ' + data[i]['semester']))

                .addItems(app.buildOptionItem(data[i]['unitNumber']+',PROHIBITIONS',['prohibitions'])
                .setTitle('Prohibitions')
                .setDescription(data[i]['prohibitions']))

                .addItems(app.buildOptionItem(data[i]['unitNumber']+',COREQUESITE',['corequesite','Co-Requesite'])
                .setTitle('Co-Requesite')
                .setDescription(data[i]['coReq']))

                .addItems(app.buildOptionItem(data[i]['untiNumber']+',PREREQUESITE',['prerequesite','Pre-Requesite'])
                .setTitle('Pre-Requesite')
                .setDescription(data[i]['preReq']))
              );
            }
            else {
                app.ask('FIT'+data[i]['unitNumber'] + ' : ' + data[i]['unitName'] + ' is available in semesters ' +
              data[i]['semester'] + '.' + ' With ' + data[i]['prohibitions'] + ' as prohibitions and '
               + data[i]['coReq'] + ' as corequesites and ' + data[i]['preReq'] + ' as prerequesite');
            }
      }
    });
  }


    console.log("test here before map");
    let actionMap = new Map();
    actionMap.set('monash.details', getFact);
    actionMap.set('monash.details.more', getFact);
    actionMap.set('unit-specific-details', getUnitDetails);
    actionMap.set('actions.intent.OPTION', getUnitLink);
    console.log("after action map");
    app.handleRequest(actionMap);


});
