mermaid.initialize({ startOnLoad: true, theme: 'default' });

function updateGraph() {
    var input = document.getElementById("input").value;
    var output = document.getElementById("output");
    var errorMessage = document.getElementById("error-message");
    output.innerHTML = "";
    output.classList.add('loading');
    errorMessage.innerHTML = "";

    try {
        mermaid.render("mermaid-diagram", input, function(svgCode) {
            output.innerHTML = svgCode;
            output.classList.remove('loading');
        });
    } catch (error) {
        errorMessage.innerHTML = "שגיאה בקוד Mermaid: " + error.message;
        output.classList.remove('loading');
    }
}

function copyToClipboard() {
    var input = document.getElementById("input");
    input.select();
    document.execCommand("copy");
    alert("הקוד הועתק ללוח!");
}

function clearEditor() {
    document.getElementById("input").value = "";
    document.getElementById("output").innerHTML = "";
    document.getElementById("error-message").innerHTML = "";
}

function toggleTheme() {
    var body = document.body;
    body.classList.toggle("dark-theme");
    var currentTheme = mermaid.getConfig().theme;
    var newTheme = currentTheme === 'default' ? 'dark' : 'default';
    mermaid.initialize({ startOnLoad: true, theme: newTheme });
    updateGraph();
    
    var themeToggle = document.querySelector('.theme-toggle i');
    themeToggle.classList.toggle('fa-moon');
    themeToggle.classList.toggle('fa-sun');
}

function loadExample() {
    var select = document.getElementById("examples");
    var input = document.getElementById("input");
    
    switch(select.value) {
        case "flowchart":
            input.value = `graph TD
A[Start] --> B{Is it raining?}
B -->|Yes| C[Take an umbrella]
B -->|No| D[Enjoy the weather]
C --> E[Go outside]
D --> E`;
            break;
        case "sequence":
            input.value = `sequenceDiagram
participant Alice
participant Bob
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts prevail...
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!`;
            break;
        case "gantt":
            input.value = `gantt
title A Gantt Diagram
dateFormat  YYYY-MM-DD
section Section
A task           :a1, 2014-01-01, 30d
Another task     :after a1  , 20d
section Another
Task in sec      :2014-01-12  , 12d
another task      : 24d`;
            break;
        case "class":
            input.value = `classDiagram
Animal <|-- Duck
Animal <|-- Fish
Animal <|-- Zebra
Animal : +int age
Animal : +String gender
Animal: +isMammal()
Animal: +mate()
class Duck{
  +String beakColor
  +swim()
  +quack()
}
class Fish{
  -int sizeInFeet
  -canEat()
}
class Zebra{
  +bool is_wild
  +run()
}`;
            break;
        case "git":
            input.value = `gitGraph
commit
commit
branch develop
commit
commit
commit
checkout main
commit
commit
merge develop
commit
commit`;
            break;
    }
    if (select.value) updateGraph();
}

function downloadSVG() {
    var svgElement = document.querySelector("#output svg");
    if (svgElement) {
        var svgData = new XMLSerializer().serializeToString(svgElement);
        var svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "mermaid_diagram.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } else {
        alert("אין תרשים להורדה. אנא צור תרשים תחילה.");
    }
}

function shareLink() {
    var currentUrl = window.location.href.split('?')[0];
    var input = document.getElementById("input").value;
    var encodedInput = encodeURIComponent(input);
    var shareableLink = currentUrl + "?code=" + encodedInput;
    navigator.clipboard.writeText(shareableLink).then(function() {
        alert("קישור לשיתוף הועתק ללוח!");
    }, function(err) {
        alert("שגיאה בהעתקת הקישור: " + err);
    });
}

function zoomOutput(zoom) {
    var output = document.getElementById("output");
    output.style.transform = `scale(${zoom})`;
    output.style.transformOrigin = "top left";
}

window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get('code');
    if (code) {
        document.getElementById("input").value = decodeURIComponent(code);
        updateGraph();
    } else {
        loadExample(); // Load a default example
    }
}
