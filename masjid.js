//import { SalatDay } from './salatday';
//import * as moment from 'moment';

class Masjid {
    constructor() {
        this.salatCal = new Array();
        this.ramadCal = new Array();
        this.masjidname = '';
        this.masjidid = '';
        this.masjidtable = '';
        this.masjidimage = '';
        this.address = '';
        this.postcode = '';
        this.city = '';
        this.seqnum = '';
        this.ioffset = '';
        this.lat = '';
        this.lon = '';
        this.distance = '';
        this.salats = '';
        this.ramadan = '';

        // application supporters
        this.todaySalatObj = '';
        this.tomorrowSalatObj = '';
        this.nextSalatName = '';
        this.nextSalatTime = '';
        
        this.nextSalatTimeTill = '';
        this.nextSalatEnglish = '';

        //this.processData();

    }

    processData() {
        console.log("Processing");


        // check for dates issues and create/update the today/tomorrow issue wrt ramadan.

        // then load up the todat/tomorrow objects for Salat Data
        // this will be the primary use of the masjid objects data source.
        // only load 40 days of data and then jus use localstorage.

        //can add a sequence checker later.
    }
    clearAll() {
        this.salatCal = [];
        this.ramadCal = [];
        this.masjidname = '';
        this.masjidid = '';
        this.masjidtable = '';
        this.masjidimage = '';
        this.address = '';
        this.postcode = '';
        this.city = '';
        this.seqnum = '';
        this.ioffset = '';
        this.lat = '';
        this.lon = '';
        this.distance = '';
        this.salats = '';
        this.ramadan = '';

        // application supporters
        this.todaySalatObj = '';
        this.tomorrowSalatObj = '';
        this.nextSalatName = '';
        this.nextSalatTime = '';
        
        this.nextSalatTimeTill = '';
        this.nextSalatEnglish = '';
    }

    fromJSON(obj) {
        this.clearAll()
        console.log("In MASJID - From Obj ", obj)
        this.masjidname = obj.masjidname;
        this.masjidid = obj.masjidid;
        this.masjidtable = obj.masjidtable;
        this.masjidimage = obj.masjidimage;
        this.address = obj.address;
        this.postcode = obj.postcode;
        this.city = obj.city;
        this.seqnum = obj.seqnum;
        this.ioffset = obj.ioffset;
        this.lat = obj.lat;
        this.lon = obj.lon;
        this.distance = obj.distance;

        //console.log("Salats", obj.salats.length)
        for(let s=0; s < obj.salats.length; s++) {
            var _salat = new SalatDay();
            _salat.fromJSON(JSON.stringify(obj.salats[s]))
            //console.log("Into SalatCal", _salat)
            this.salatCal.push(_salat)
        }

        //console.log("Ramadan", obj.ramadan.length)
        for(let r=0; r < obj.ramadan.length; r++) {
            var _salat = new SalatDay();
            _salat.fromJSON(JSON.stringify(obj.ramadan[r]))
            this.ramadCal.push(_salat)
        }

        // KEEP A RAW COPY
        this.salats = obj.salats;
        this.ramadan = obj.ramadan;

    }

    distanceFrom(lon, lat) {

        function haversineDistance(coords1, coords2, isMiles = 1) {
            function toRad(x) {
              return x * Math.PI / 180;
            }
          
            var lon1 = coords1[0];
            var lat1 = coords1[1];
          
            var lon2 = coords2[0];
            var lat2 = coords2[1];
          
            var R = 6371; // km
          
            var x1 = lat2 - lat1;
            var dLat = toRad(x1);
            var x2 = lon2 - lon1;
            var dLon = toRad(x2)
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
          
            if(isMiles) d /= 1.60934;
          
            return d + "";

          }

        let llon = parseFloat(lon);
        let llat = parseFloat(lat);
        let lpoint = [];
        let mpoint = [];

        lpoint.push(llon)
        lpoint.push(llat)
        
        

        let mlon = parseFloat(this.lon);
        let mlat = parseFloat(this.lat);

        mpoint.push(mlon)
        mpoint.push(mlat)
        
        // console.log("Lon:(num)", llon);
        // console.log("Lat:(num)", llat);

        // console.log("MLon:(num)", mlon);
        // console.log("MLat:(num)", mlat);

        return haversineDistance(lpoint, mpoint, 5);
        
    }
    

    islamicDate(month = false) {
        function gmod(n, m) { 
            return ((n % m) + m) % m;
        }
        function kuwaiticalendar(adjust) {
            var today = new Date();
            if (adjust) {
                let adjustmili = 1000 * 60 * 60 * 24 * adjust;
                let todaymili = today.getTime() + adjustmili;
                today = new Date(todaymili);
            }
            let day = today.getDate();
            let month = today.getMonth();
            let year = today.getFullYear();
            let m = month + 1;
            let y = year;
            if (m < 3) {
                y -= 1;
                m += 12;
            }
            let a = Math.floor(y / 100.);
            let b = 2 - a + Math.floor(a / 4.);
            if (y < 1583)
                b = 0;
            if (y == 1582) {
                if (m > 10)
                    b = -10;
                if (m == 10) {
                    b = 0;
                    if (day > 4)
                        b = -10;
                }
            }
            let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
            b = 0;
            if (jd > 2299160) {
                a = Math.floor((jd - 1867216.25) / 36524.25);
                b = 1 + a - Math.floor(a / 4.);
            }
            let bb = jd + b + 1524;
            let cc = Math.floor((bb - 122.1) / 365.25);
            let dd = Math.floor(365.25 * cc);
            let ee = Math.floor((bb - dd) / 30.6001);
            day = (bb - dd) - Math.floor(30.6001 * ee);
            month = ee - 1;
            if (ee > 13) {
                cc += 1;
                month = ee - 13;
            }
            year = cc - 4716;
            if (adjust) {
                var wd = gmod(jd + 1 - adjust, 7) + 1;
            } else {
                var wd = gmod(jd + 1, 7) + 1;
            }
            let iyear = 10631. / 30.;
            let epochastro = 1948084;
            let epochcivil = 1948085;
            let shift1 = 8.01 / 60.;
            let z = jd - epochastro;
            let cyc = Math.floor(z / 10631.);
            z = z - 10631 * cyc;
            let j = Math.floor((z - shift1) / iyear);
            let iy = 30 * cyc + j;
            z = z - Math.floor(j * iyear + shift1);
            let im = Math.floor((z + 28.5001) / 29.5);
            if (im == 13)
                im = 12;
            let id = z - Math.floor(29.5001 * im - 29);
            var myRes = new Array(8);
            myRes[0] = day; //calculated day (CE)
            myRes[1] = month - 1; //calculated month (CE)
            myRes[2] = year; //calculated year (CE)
            myRes[3] = jd - 1; //julian day number
            myRes[4] = wd - 1; //weekday number
            myRes[5] = id; //islamic date
            myRes[6] = im - 1; //islamic month
            myRes[7] = iy; //islamic year
            return myRes;
        }
        function writeIslamicDate(adjustment, month = false) {
            var wdNames = new Array("Ahad", "Ithnin", "Thulatha", "Arbaa", "Khams", "Jumuah", "Sabt");
            var iMonthNames = new Array("Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
                    "Jumadal Ula", "Jumadal Akhira", "Rajab", "Sha'ban",
                    "Ramadan", "Shawwal", "Dhul Qa'ada", "Dhul Hijja");
            var iDate = kuwaiticalendar(adjustment);
            var outputIslamicDate = wdNames[iDate[4]] + ", "
                    + iDate[5] + " " + iMonthNames[iDate[6]] + " " + iDate[7] + " AH";
                    
            if(month) outputIslamicDate = iMonthNames[iDate[6]];

            return outputIslamicDate;
        }

        // let output = writeIslamicDate(this.ioffset);
        // console.log(output);
        return writeIslamicDate(this.ioffset, month);
    }

    nextSalat() {

        // tuff one...
        var now = moment();
        var curr = now.format('HH:mm');
        //var nextSalat = "";
        
        var today = moment(now).format('YYYY-MM-DD');
        var tomorrow = moment(now).add(1, 'day').format('YYYY-MM-DD'); // use moment to add 1 day
        // console.log("today", today);
        //console.log("date diff  ", now.to(moment("13:45"), 'HH:mm'));
        //info.innerHTML += "<p>tomorrow " + tomorrow + "</p>";
    //  var rowitem = getRowDate(ObjArray, formattedDate);


    var todSalObj = this.salatCal.filter(function(item) {
        return item._salatDate === today;
    })[0];

    // console.log("TodObj", todSalObj);
    
    var tomSalObj = this.salatCal.filter(function(item) {
        return item._salatDate === tomorrow;
    })[0];

        
        var jummaTime = moment(todSalObj._jumma, 'HH:mm').format('HH:mm');
        var jumma = (now.day() == 5 ? true : false);

        var fajarStartTime = moment(todSalObj._fajarStart, 'HH:mm').format('HH:mm');
        var fajarJamatTime = moment(todSalObj._fajarJamat, 'HH:mm').format('HH:mm');
        var fajarEndTime = moment(todSalObj._sunrise, 'HH:mm').format('HH:mm');
        var ishrakTime = moment(todSalObj._sunrise, 'HH:mm').add(10, "m").format("HH:mm");
        var zawalStartTime = moment(todSalObj._zawalstart, 'HH:mm').add(0, "m").format("HH:mm");
        var zawalEndTime = moment(todSalObj._zuhrstart, 'HH:mm').add(0, "m").format("HH:mm");
        var zuhrStartTime = moment(todSalObj._zuhrstart, 'HH:mm').add(0, "m").format("HH:mm");
        var zuhrJamatTime = moment(todSalObj._zuhrjamat, 'HH:mm').format('HH:mm');
        var zuhrEndTime = moment(todSalObj._asarstart, 'HH:mm').format('HH:mm');
        var asarStartTime = moment(todSalObj._asarstart, 'HH:mm').format('HH:mm');
        var asarJamatTime = moment(todSalObj._asarjamat, 'HH:mm').format('HH:mm');
        var asarEndTime = moment(todSalObj._maghrib, 'HH:mm').format('HH:mm');
        var maghribStartTime = moment(todSalObj._maghrib, 'HH:mm').add(3, "m").format("HH:mm");
        var maghribEndTime = moment(todSalObj._maghrib, 'HH:mm').add(35, "m").format("HH:mm");
        var eshaStartTime = moment(todSalObj._eshastart, 'HH:mm').format('HH:mm');
        var eshaJamatTime = moment(todSalObj._eshajamat, 'HH:mm').format('HH:mm');
    
        if (jumma) {
            zuhrJamatTime = jummaTime;
        }
           
        if ((curr <= fajarJamatTime) && (curr < zuhrJamatTime) && (curr < asarJamatTime) && (curr < maghribStartTime) && (curr < eshaJamatTime)) {
            //nextSalat = "FAJAR";
            var elem = document.getElementsByClassName("f")
            elem.className += "on"

            this.nextSalatName = "FAJAR";
            this.nextSalatTime = fajarJamatTime;
            this.nextSalatTimeTill = now.to(moment(fajarJamatTime, 'HH:mm'));
        } else if ((curr > fajarJamatTime) && (curr <= ishrakTime) && (curr < zuhrJamatTime) && (curr < asarJamatTime) && (curr < maghribStartTime) && (curr < eshaJamatTime)) {
            //nextSalat = "ISHRAK";
            this.nextSalatName = "ISHRAK";
            this.nextSalatTime = ishrakTime;
            this.nextSalatTimeTill = now.to(moment(ishrakTime, 'HH:mm'));
        } else if ((curr > fajarJamatTime) && (curr > ishrakTime) && (curr <= zuhrJamatTime) && (curr < asarJamatTime) && (curr < maghribStartTime) && (curr < eshaJamatTime)) {
            //nextSalat = "ZUHR";
            this.nextSalatName = "ZUHR";
            this.nextSalatTime = zuhrJamatTime;
            this.nextSalatTimeTill = now.to(moment(zuhrJamatTime, 'HH:mm'));
            //console.log(this)
            if (jumma) this.nextSalatName = "JUMMAH";
        
        } else if ((curr > fajarJamatTime) && (curr > zuhrJamatTime) && (curr <= asarJamatTime) && (curr < maghribStartTime) && (curr < eshaJamatTime)) {
            //nextSalat = "ASAR";
            this.nextSalatName = "ASAR";
            this.nextSalatTime = asarJamatTime;
            this.nextSalatTimeTill = now.to(moment(asarJamatTime, 'HH:mm'));
        } else if ((curr > fajarJamatTime) && (curr > zuhrJamatTime) && (curr > asarJamatTime) && (curr <= maghribStartTime) && (curr < eshaJamatTime)) {
            //nextSalat = "MAGHRIB";
            this.nextSalatName = "MAGHRIB";
            this.nextSalatTime = maghribStartTime;
            this.nextSalatTimeTill = now.to(moment(maghribStartTime, 'HH:mm'));
        } else if ((curr > fajarJamatTime) && (curr > zuhrJamatTime) && (curr > asarJamatTime) && (curr > maghribStartTime) && (curr <= eshaJamatTime)) {
            //nextSalat = "ESHA";
            this.nextSalatName = "ESHA";
            this.nextSalatTime = eshaJamatTime;
            this.nextSalatTimeTill = now.to(moment(eshaJamatTime, 'HH:mm'));
        } else if ((curr > fajarJamatTime) && (curr > zuhrJamatTime) && (curr > asarJamatTime) && (curr > maghribStartTime) && (curr > eshaJamatTime)) {
            this.nextSalatName = "FAJAR";
            this.nextSalatTime = moment(tomSalObj._fajarJamat, 'HH:mm').format('HH:mm')
            this.nextSalatTimeTill = now.to(moment(tomSalObj._fajarJamat, 'HH:mm').add("days", 1))
        }

        //this.nextsalatname = nextSalat;
        if (fajarJamatTime == "00:00" || zuhrJamatTime == "00:00" ) {
            this.nextSalatName = "NO TIMES LOADED!";
            this.nextSalatTime = "00:00";
            this.nextSalatTimeTill = "00:00";
        }

        // console.log("IN NEXTSALAT AND OBJ IS ", this);
        return this.nextSalatName;

        //document.getElementById('jummatime').innerHTML = jummaTime;
        // console.log("time", now)
        // console.log("timeformatted", now.format('HH:mm:ss'))
        // console.log("NEXT - SALAT IS : salat", nextSalat)
        // var text;

        //document.getElementById('countdownLabel').innerHTML = "TIME REMAINING " + nextSalat;
        /*switch (nextSalat) {
            case "FAJAR":
                text = "FAJAR is good!";
          //      setFajar(todRow, tomRow);
                break;
            case "ISHRAK":
                text = "I am ishrak.";
            //    setIshrak(todRow)
                break;
            case "ZUHR":
                text = "I am zuhr.";
            //    setZuhr(todRow, tomRow)
                break;
            case "ASAR":
                text = "How you like asar?";
            //    setAsar(todRow, tomRow);
                break;
            case "MAGHRIB":
                text = "How you like maghrib?";
            //    setMaghrib(todRow, tomRow);
                break;
            case "ESHA":
                text = "How you like esha?";
            //    setEsha(todRow, tomRow);
                break;
            case "AFTERESHA":
                text = "How DID you like esha?";
            //    setAfterEsha(tomRow, tomRow);
                break;
            default:
                text = "I have never heard of that salat...";
        }
        */


    }


    todaySalat() {
        //return this.todSalObj;


        var today = moment(new Date().toISOString().substring(0, 10)).format('YYYY-MM-DD');
        //console.log("THIS ONE !!! Today is", today);

        // var todSal = this.salats.filter(function(item) {
        //     return item.salatdate == today;
        // })[0];

        // console.log(todSal);
        

        var todSalObj = this.salatCal.filter(function(item) {
            return item._salatDate === today;
        })[0];

        //console.log("THIS ONE !!! TodObj", todSalObj);
        
        return todSalObj;

    }


    tomorSalat() {

        //var today = moment(new Date().toISOString().substring(0, 10)).format('YYYY-MM-DD');
        var tomorrow = moment(new Date().toISOString().substring(0, 10)).add(1, 'day').format('YYYY-MM-DD');
        //console.log("Tomay is", tomorrow);

        var tomSal = this.salats.filter(function(item) {
            return item.salatdate == tomorrow;
        })[0];

       // console.log(tomSal);
        


        var tomSalObj = this.salatCal.filter(function(item) {
            return item._salatDate === tomorrow;
        })[0];

       // console.log("TomObj", tomSalObj);
        return tomSalObj;
            
    }


    getSalatBlock() {

        var newSalatData = [];
        var today = moment(new Date().toISOString().substring(0, 10)).format('YYYY-MM-DD');
      //  console.log("Today is", today);
        var tomorrow = moment(new Date().toISOString().substring(0, 10)).add(1, 'day').format('YYYY-MM-DD');
      //  console.log("Tomay is", tomorrow);

        var todSalObj = this.salatCal.filter(function(item) {
            return item._salatDate === today;
        })[0];

        var tomSalObj = this.salatCal.filter(function(item) {
            return item._salatDate === tomorrow;
        })[0];

        newSalatData.push(todSalObj);
        newSalatData.push(tomSalObj);
        

        return newSalatData;



        

    }

    print() {
        console.log("In Masjid Obj:print()",this.masjidname)

    }

}

// export default Masjid;