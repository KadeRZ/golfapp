let courseCollection;

let numPlayers;
let teeSelection;
let nameArray = [];

let modalId;

function loadObject() {
    $('.menu-container').css('display', 'none');
    $('.setup-container').css('display', 'flex');

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            courseCollection = JSON.parse(this.responseText);
            console.log(courseCollection);

            for (let i = 0; i < courseCollection.courses.length; i++) {
                $('#select-course').append('<option value="' + courseCollection.courses[i].id + '">' + courseCollection.courses[i].name + '</option>')
            }
        }
    };
    xhttp.open('GET', 'https://golf-courses-api.herokuapp.com/courses', true);
    xhttp.send();
}

let myCourse;

function loadCourse(courseid) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            myCourse = JSON.parse(this.responseText);
            console.log(myCourse);

            loadTee();
        }
    };
    xhttp.open('GET', 'https://golf-courses-api.herokuapp.com/courses/' + courseid, true);
    xhttp.send();
}
function loadTee() {
    $('#select-tee').html('<option>Select Tee</option>');
    let teeArray = myCourse.data.holes[0].teeBoxes;
    for(let i = 0; i < teeArray.length; i++) {
        $('#select-tee').append('<option value="' + i + '">' + teeArray[i].teeType + '</option>')
    }
}
function setTee(tee) {
    teeSelection = tee;
}
function buildCard() {
    $('.game-container').css('display', 'flex');
    $('.setup-container').css('display', 'none');

    buildHole();
    buildYard();
    buildPar();
    buildHcp();

    buildPlayers();

    for(let i = 1; i <= numPlayers; i++) {
        $('.score-message').append(`<div id="score-modal${i}" class="score-modal"></div>`);
    }
}
function buildHole() {
    for(let i = 1; i <= 18; i++) {
        $('.hole-container').append(`<div id="hole${i}" class="hole">${i}</div>`);

        if(i == 9) {
            $('.hole-container').append(`<div id="out-hole" class="out">Out</div>`);
        }
        if(i == 18) {
            $('.hole-container').append(`<div id="in-hole" class="in">In</div>`);
            $('.hole-container').append(`<div id="total-hole" class="total">Total</div>`);
        }
    }
}
function buildYard() {
    for(let i = 0; i < 18; i++) {
        $('.yard-container').append(`<div id="yard${i}" class="yard">${myCourse.data.holes[i].teeBoxes[teeSelection].yards}</div>`);
        if(i == 8) {
            $('.yard-container').append(`<div id="out-yard" class="out"></div>`);
        }
        if(i == 17) {
            $('.yard-container').append(`<div id="in-yard" class="in"></div>`);
            $('.yard-container').append(`<div id="total-yard" class="total"></div>`);
        }
    }
    $(`#out-yard`).append(calcOut('yard'));
    $(`#in-yard`).append(calcIn('yard'));
    $(`#total-yard`).append(calcTotal('Yard'));
}
function buildPar() {
    for(let i = 0; i < 18; i++) {
        $('.par-container').append(`<div id="par${i}" class="par">${myCourse.data.holes[i].teeBoxes[teeSelection].par}</div>`);

        if(i == 8) {
            $('.par-container').append(`<div id="out-par" class="out"></div>`);
        }
        if(i == 17) {
            $('.par-container').append(`<div id="in-par" class="in"></div>`);
            $('.par-container').append(`<div id="total-par" class="total"></div>`);
        }
    }
    $(`#out-par`).append(calcOut('par'));
    $(`#in-par`).append(calcIn('par'));
    $(`#total-par`).append(calcTotal('Par'));
}
function buildHcp() {
    for (let i = 0; i < 18; i++) {
        $('.hcp-container').append(`<div id="hcp${i}" class="hcp">${myCourse.data.holes[i].teeBoxes[teeSelection].hcp}</div>`);

        if (i == 8) {
            $('.hcp-container').append(`<div id="out-hcp" class="out"></div>`);
        }
        if (i == 17) {
            $('.hcp-container').append(`<div id="in-hcp" class="in"></div>`);
            $('.hcp-container').append(`<div id="total-hcp" class="total"></div>`);
        }
    }
    $(`#out-hcp`).append('-');
    $(`#in-hcp`).append('-');
    $(`#total-hcp`).append('-');
}
function buildPlayers() {
    for (let i = 1; i <= numPlayers; i++) {
        $('.game-container').append(`<div id="player-container${i}" class="player-container"><div class="card-title">${nameArray[i-1]}</div></div>`);
        for(let p = 0; p < 18; p++) {
            $(`#player-container${i}`).append(`<input id="p${i}score${p}" class="score" type="number" onchange="updateScore(${i}, this.value, ${p}, this.id)">`);

            if(p == 8) {
                $(`#player-container${i}`).append(`<div id="out-player${i}" class="out">0</div>`);
            }
            if(p == 17) {
                $(`#player-container${i}`).append(`<div id="in-player${i}" class="in">0</div>`);
                $(`#player-container${i}`).append(`<div id="total-player${i}" class="total">0</div>`);
            }
        }
    }
}
function updateScore(playerNum, value, holeNum, myId) {
    checkNumber(value, myId);

    let outTotal = 0;
    let tempOut = 0;
    let inTotal = 0;
    let tempIn = 0;

    if(holeNum < 9){
        for(let o = 0; o < 9; o++) {
            tempOut = Number($(`#p${playerNum}score${o}`).val());
            outTotal += tempOut;
        }
        $(`#out-player${playerNum}`).html(outTotal);
    }
    else if(holeNum >= 9){
        for(let i = 9; i < 18; i++) {
            tempIn = Number($(`#p${playerNum}score${i}`).val());
            inTotal += tempIn;
        }
        $(`#in-player${playerNum}`).html(inTotal);
    }
    outTotal = Number($(`#out-player${playerNum}`).text());
    inTotal = Number($(`#in-player${playerNum}`).text());
    let finalTotal = outTotal + inTotal;
    $(`#total-player${playerNum}`).text(finalTotal);

    if($(`#p${playerNum}score${17}`).val()) {
        compareToPar(playerNum, finalTotal);
    }
}
function compareToPar(playerNum, playerTotal) {
    $('.score-message').css('display', 'flex');
    let holePar = Number($('#totalPar').text());
    let comparePar = playerTotal - holePar;

    if(comparePar == 0) {
        $(`#score-modal${playerNum}`).css('display', 'flex');
        $(`#score-modal${playerNum}`).html(`<div id="score-message${playerNum}">Right On Par ${nameArray[playerNum-1]}! <br> Score: ${comparePar}</div>`);
    }
    else if(comparePar < 0) {
        $(`#score-modal${playerNum}`).css('display', 'flex');
        $(`#score-modal${playerNum}`).html(`<div id="score-message${playerNum}">On to the PGA ${nameArray[playerNum-1]}! <br> Score: ${comparePar}</div>`);
    }
    else {
        $(`#score-modal${playerNum}`).css('display', 'flex');
        $(`#score-modal${playerNum}`).html(`<div id="score-message${playerNum}"> Better Luck Next Time ${nameArray[playerNum-1]}! <br> Score: +${comparePar}</div>`);
    }
}
function calcOut(rowName) {
    let outTotal = 0;
    let outTemp = 0;
    for(let i = 0; i < 9; i++) {
        outTemp = Number($(`#${rowName}${i}`).text());
        outTotal += outTemp;
    }
    return outTotal;
}
function calcIn(rowName) {
    let inTotal = 0;
    let inTemp = 0;
    for(let i = 9; i < 18; i++) {
        inTemp = Number($(`#${rowName}${i}`).text());
        inTotal += inTemp;
    }
    return inTotal;
}
function calcTotal(rowName) {
    let outTotal = Number($(`#out${rowName}`).text());
    let inTotal = Number($(`#in${rowName}`).text());

    return outTotal + inTotal;
}
function getNames(playerNum) {
    numPlayers = Number(playerNum);
    $('.player-name').html('');
    for (let i = 1; i <= numPlayers; i++) {
        $('.player-name').append(`<input placeholder="Enter Name" onchange="checkNames(this.value, ${i}, this.id)" class="player" id="player${i}" type="text">`);
        nameArray[i-1] = '';
    }
}
function checkNames(name, playNum, thisId) {
    let validate = true;

    for(let i = 0; i < numPlayers; i++) {
        if(i != playNum-1) {
            if(nameArray[i] == name) {
                validate = false;
            }
        }
    }
    if(validate) {
        nameArray[playNum-1] = name;
    }
    else {
        modalId = thisId;
        displayNameModal()
    }
}
function checkNumber(value, thisId) {
    if(value < 0) {
        modalId = thisId;
        displayNumModal();
    }
}
function displayNumModal() {
    $('.number-modal').css('display', 'flex');
}

function clearNumModal() {
    $('.number-modal').css('display', 'none');
    $(`#${modalId}`).val('');
}

function displayNameModal() {
    $('.name-modal').css('display', 'flex');
}

function clearNameModal() {
    $('.name-modal').css('display', 'none');
    $(`#${modalId}`).val('');
}