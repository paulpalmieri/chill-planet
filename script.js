const buildings = [
    {
        name: 'Thé à la menthe',
        cost: 10,
        clickAmount: 1,
        owned: 1,
    },
    {
        name: 'Sofa',
        cost: 100,
        clickAmount: 10,
        owned: 1,
    }
];





clicks = 1000;
clickRate = 0;

buildings.forEach(element => {
    clickRate += element.owned * element.clickAmount;
});

clickButton = document.getElementById('click');
clickDisplayText = document.getElementById('clickTextDisplay');
clickRateDisplayText = document.getElementById('clickRateTextDisplay');

clickRateDisplayText.innerHTML = `${clickRate}/s`;




buildingContainer = document.getElementById('buildingContainer');

// buildings.forEach(e => console.log(e.name));

// instantiate all building buttons

buildings.forEach(element => {
    buildingContainer.appendChild(instantiateBuildingButtons(element));
});

// for (i = 0; i < buildings.length; i++) {
//     buildingContainer.appendChild(instantiateBuildingButtons(buildings[i]));
//   }

clickButton.onclick = function() {
    clicks++;
    clickDisplayText.innerHTML = clicks;
}

function instantiateBuildingButtons(building) {
    tmpContainer = document.createElement('div');
    tmpName = document.createElement('span');
    tmpCost = document.createElement('span');
    tmpOwned = document.createElement('span');
    tmpButton = document.createElement('button');

    tmpContainer.className = 'building-container';
    tmpOwned.id = building.name;

    tmpName.innerHTML = building.name;
    tmpCost.innerHTML = `Cost: ${building.cost}`;
    tmpOwned.innerHTML = `Owned: ${building.owned}`;
    tmpButton.innerHTML = 'Buy!';

    tmpContainer.appendChild(tmpName);
    tmpContainer.appendChild(document.createElement('br'));
    tmpContainer.appendChild(tmpCost);
    tmpContainer.appendChild(document.createElement('br'));
    tmpContainer.appendChild(tmpOwned);
    tmpContainer.appendChild(tmpButton);


    tmpButton.onclick = function() {
        if(clicks >= building.cost) {
            building.owned++;
            // tmpOwned.innerHTML = building.owned;
            document.getElementById(building.name).innerHTML = `Owned: ${building.owned}`;
            clickRate += building.clickAmount;
            console.table(buildings);
            clickRateDisplayText.innerHTML = `${clickRate}/s`;

        }
    }

    return tmpContainer;
}




// update clicks based on buildings
function updateClicks() {
    buildings.forEach(element => {
        clicks += element.clickAmount * element.owned;
        clickDisplayText.innerHTML = clicks;
    });
}

window.setInterval(updateClicks, 100);




