console.log('test');

clicks = 0;

clickButton = document.getElementById('click');
clickDisplayText = document.getElementById('clickTextDisplay');

clickButton.onclick = function() {
    clicks++;

    clickDisplayText.innerHTML = clicks;
}