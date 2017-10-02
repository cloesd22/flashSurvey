// Firebase access point is an interface that allows code to make DB access calls irresepctive of the DB.
// All databse interfaces must implement
// CRUD, CREATE, READ, UPDATE DELETE keyword functions taking in arguments as specified.

module.exports = { FirebaseDBAAP: FirebaseDBAAP }


var admin = require("firebase-admin");

var serviceAccount = require("./btnproject-eef7a-firebase-adminsdk-5xsjs-31d64b18dc.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://btnproject-eef7a.firebaseio.com"
});


function FirebaseDBAAP(table) {

    var db = admin.database();
    var ref = db.ref(table);


    this.ReadALLRT = () => {
        //pulls all data from file
        return new Promise((resolve, reject) => {
            ref.once("value", (snapshot) => {
                resolve(snapshot.val());

            }).catch((err) => {
                reject(err.code);
            })

        })

    }

    this.ReadSPEC = (property, spec) => {
        //returns specific record if it exists
        return new Promise((resolve, reject) => {
            if (spec === undefined || null) {
                resolve('empty');
            } else {

                ref.orderByChild(property).equalTo(spec).limitToFirst(1).once("value", (data) => {
                    if (data.val() == null) {
                        resolve('empty');
                    } else {
                        resolve(data.val());
                    }
                }, (err) => {
                    reject("error -" + err.code);
                })
            }

        })
    }

    this.CreateSPEC = (data) => {

        return new Promise((resolve, reject) => {

            if (!data || data.vote == 6) {
                reject("Invalid Data");
                return;
            }


            var pushRef = ref;
            pushRef = pushRef.push();
            pushRef.set(data).then((result) => {
                resolve("Success");
            }).catch((err) => {
                reject("Error - " + err.code)
            })

        })
    }


    this.OverwriteSPEC = (data) => {

        return new Promise((resolve, reject) => {

            if (!data || data.vote == 6) {
                reject("Invalid Data");
                return;
            }

            var pushRef = ref;
            pushRef.set(data).then((result) => {
                resolve("Success");
            }).catch((err) => {
                reject("Error - " + err.code)
            })
        })
    }

    this.DeleteSPEC = (property, value) => {
        return new Promise((resolve, reject) => {

            ref.orderByChild(property).equalTo(value).once('value', (snapshot) => {
                let updates = {};
                snapshot.forEach((child) => {
                    updates[child.key] = null
                })
                ref.update(updates);
                resolve("Success");
            }).catch((err) => {
                reject("Error -" + err.code)
            })
        })
    }

    this.addChangeListener = (callback) => {

        return new Promise((resolve, reject) => {
            ref.orderByKey().limitToFirst(5).on("value", (snapshot) => {
                callback(snapshot.val());
                resolve(ref);

            }, (err) => {
                reject("Error - " + err.code);
            })
        })
    }

    // ----------------Listeners----------------//


    //------------------VoteSpecific--------------------------//
    //Needs to be a n efficient function which takes in an object containing date and vote, and incremenets the vote in 1 db request if possible.

    /*     this.updateVote = (voteObject)=>{
            return new Promise((resolve,reject)=>{
                ref.transaction((voteObject) => {
                    if(voteObject.vote==1){
                        return {currentVote.for:currentVote.for+1};
                    }else if (voteObject.vote==0){
                        return currentVote.against = currentVote.against+1;
                    }
                })
            })
        } */

}