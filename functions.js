var data = {};

function loadTextData() {

    var input = prompt('Másold be a szöveget:');
    parseInput(input);

}

function parseInput(input) {

    var splitarray = input.split("|");

    for (var i = 0; i < splitarray.length; i++) {

        if (splitarray[i] != "")
            parseLine(splitarray[i]);

    }

    display();

    //cookiemagic();

}

function parseLine(instring) {

    var splitarray = instring.split(":");
    var subject = splitarray[0].trim();
    var marks = splitarray[1].trim().split(" ");
    data[subject] = marks;

}

function addSubject() {

    var subjectname = prompt("Tantárgy neve:");
    data[subjectname] = [];
    display();

}

function deleteSubject(subject) {

    delete data[subject];
    display();

}

function newMark(subject) {

    var output = "";
    output += "Jegy típusa: <select id='marktype' name='marktype'>";

    var jegytipusok = {"k": "Kis jegy", "n": "Normál jegy", "d": "Dolgozat jegy", "t": "Témazáró jegy", "v": "Vizsga jegy"};

    for (var tipusindex in jegytipusok) {
        output += "<option value='" + tipusindex + "'>" + jegytipusok[tipusindex] + "</option>";
    }

    output += "</select><br>";
    output += "Jegy értéke: <select id='markvalue' name='markvalue'>";

    var jegyek = ["1", "1/2", "2", "2/3", "3", "3/4", "4", "4/5", "5"];

    for (var jegy in jegyek) {
        output += "<option value='" + jegyek[jegy] + "'>" + jegyek[jegy] + "</option>";
    }

    output += "</select><br>";
    output += "<input type='submit' onclick='addMark(\"" + subject + "\");'>";
    output += "";

    document.getElementById("outputfield").innerHTML = output;

}

function addMark(subject) {

    var marktypeselect = document.getElementById("marktype");
    var marktype = marktypeselect.options[marktypeselect.selectedIndex].value;
    var markvalueselect = document.getElementById("markvalue");
    var markvalue = markvalueselect.options[markvalueselect.selectedIndex].value;
    data[subject].push(marktype + markvalue);

    document.getElementById("outputfield").innerHTML = "";
    display();

}

function openMark (subject, markindex) {

    var mark = data[subject][markindex].trim();

    var output = "";
    output += "Jegy típusa: <select id='marktype' name='marktype'>";

    var jegytipusok = {"k": "Kis jegy", "n": "Normál jegy", "d": "Dolgozat jegy", "t": "Témazáró jegy", "v": "Vizsga jegy"};

    for (var tipusindex in jegytipusok) {
        output += "<option";
        if (mark.substring(0, 1) == tipusindex) {
            output += " selected";
        }
        output += " value='" + tipusindex + "'>" + jegytipusok[tipusindex] + "</option>";
    }

    output += "</select><br>";
    output += "Jegy értéke: <select id='markvalue' name='markvalue'>";

    var jegyek = ["1", "1/2", "2", "2/3", "3", "3/4", "4", "4/5", "5"];

    for (var jegy in jegyek) {
        output += "<option";
        if (mark.substring(1) == jegyek[jegy]) {
            output += " selected";
        }
        output += " value='" + jegyek[jegy] + "'>" + jegyek[jegy] + "</option>";
    }

    output += "</select><br>";
    output += "<input type='checkbox' id='deletemark'> Jegy törlése<br>";
    output += "<input type='submit' onclick='modifyMark(\"" + subject + "\", \"" + markindex + "\");'>";
    output += "";

    document.getElementById("outputfield").innerHTML = output;

}

function modifyMark (subject, markindex) {

    var deletecheck = document.getElementById("deletemark");
    if (deletecheck.checked) {

        delete data[subject][markindex];

    } else {
        var marktypeselect = document.getElementById("marktype");
        var marktype = marktypeselect.options[marktypeselect.selectedIndex].value;
        var markvalueselect = document.getElementById("markvalue");
        var markvalue = markvalueselect.options[markvalueselect.selectedIndex].value;
        data[subject][markindex] = marktype + markvalue;
    }

    document.getElementById("outputfield").innerHTML = "";
    display();

}

function display() {

    var select = document.getElementById("sulyozas");
    weight = select.options[select.selectedIndex].value;

    var output = "";

    for (var subject in data) {

        var avg = 0;
        var base = 0;
        var sum = 0;

        output += "<tr><td id='tantargy'>";
        output += subject;
        output += " <a href='#' onclick='deleteSubject(\"" + subject + "\");'>-törlés</a>";
        output += "</td><td id='jegyek'>";

        for (var markindex in data[subject]) {

            var mark = data[subject][markindex].trim();

            if (mark != "" && mark != " ") {

                var multiplier = 0;

                switch(mark.substring(0, 1)) {

                    case "k":
                        multiplier = parseInt(weight.substring(0, 1));
                        output += "<a href='#'><span class='kis' onclick='openMark(\"" + subject + "\", \"" + markindex + "\");'>" + mark.substring(1) + "</span></a>";
                        break;
                    case "n":
                        multiplier = parseInt(weight.substring(1, 2));
                        output += "<span class='normal' onclick='openMark(\"" + subject + "\", \"" + markindex + "\");'>" + mark.substring(1) + "</span>";
                        break;
                    case "d":
                        multiplier = parseInt(weight.substring(2, 3));
                        output += "<span class='dolgozat' onclick='openMark(\"" + subject + "\", \"" + markindex + "\");'>" + mark.substring(1) + "</span>";
                        break;
                    case "t":
                        multiplier = parseInt(weight.substring(3, 4));
                        output += "<span class='temazaro' onclick='openMark(\"" + subject + "\", \"" + markindex + "\");'>" + mark.substring(1) + "</span>";
                        break;
                    case "v":
                        multiplier = parseInt(weight.substring(4, 5));
                        output += "<span class='vizsga' onclick='openMark(\"" + subject + "\", \"" + markindex + "\");'>" + mark.substring(1) + "</span>";
                        break;

                }

                base += multiplier;
                sum += getMarkValue(mark) * multiplier;

            }

        }

        avg = (sum/base).toFixed(2);

        output += "</td><td id='ujjegy'><a href='#' onclick='newMark(\"";
        output += subject;
        output += "\");'>+ jegy</a></td><td id='atlag'>";
        output += avg;
        output += "</td><td id='bizonyitvany'>";
        output += getFinalMark(avg);
        output += "</td></tr>";

    }

    output += "<tr><td id='tantargy'><a href='#' onclick='addSubject();'>+ tantárgy</a></td><td id='jegyek' colspan='2'></td><td id='atlag'></td><td id='bizonyitvany'></td></tr>";

    document.getElementById("tbody").innerHTML = output;

}

function getMarkValue(str) {

    switch(str.substring(1).length) {

        case 1: return parseInt(str.substring(1, 2));
        case 3: return ((parseInt(str.substring(1, 2)) + parseInt(str.substring(3, 4))) / 2);

    }

}

function saveTextData() {

    var output = "";

    for (var subject in data) {

        output += subject + ": ";

        for (var markindex in data[subject]) {

            var mark = data[subject][markindex].trim();

            output += mark + " ";

        }

        output += "| ";

    }

    document.getElementById("outputfield").innerHTML = "Másold ki az alábbi szöveget, és mentsd el biztos helyre! <blockquote>" + output + "</blockquote>";

}

function cookiemagic() {

    if (input != "") {

        var date = new Date();
        date.setTime(date.getTime()+(365*24*60*60*1000));
        cookiestring = "data=" + input + "; expires=" + date.toGMTString() + "; path=/";
        document.cookie = cookiestring;

    } else {

        var date = new Date();
        date.setTime(date.getTime()-(365*24*60*60*1000));
        document.cookie = "data=; expires=" + date.toGMTString() + "; path=/";

    }

}

function getCookieData() {

    var temp = document.cookie.split(";");
    var data = temp[0].split("=")[1];
    var textarea = document.getElementById("notes");
    //textarea.value = data;

}

function getFinalMark(avg) {

    var mark;

    if (avg < 1.5) {

        mark = "elégtelen";

    } else if (avg < 2.5) {

        mark = "elégséges";

    } else if (avg < 3.5) {

        mark = "közepes";

    } else if (avg < 4.5) {

        mark = "jó";

    } else {

        mark = "jeles";

    }

    return mark;

}
