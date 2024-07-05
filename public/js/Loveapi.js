

// Api key en link confirmeren
const apiKey = "4";
const endpoint = 'https://api.apiverve.com/v1/lovecalculator';

// deze functie haalt het resultaat op met de velden die ingevuld zijn.
async function getLoveCalculation(name1, name2) {
  
    const url = `${endpoint}?name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}`;
    
    try {
    
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // kijkt of het gelukt is, en geeft anders een error mee.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // json parsen
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching love calculation:', error);
    }
}

// even listener die kijkt wanneer het uitgevoerd moet worden en wat de waardes van naam 1 en 2 is.
document.getElementById('loveForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name1 = document.getElementById('name1').value;
    const name2 = document.getElementById('name2').value;
    const result = await getLoveCalculation(name1, name2);
console.log(result);
console.log(result.data.lovePercentage);
    // resultaat laten zien.
    document.getElementById('result').innerText = JSON.stringify(result.data.response);
    

    // deze code laat zien hoeveel procent de match was, samen met een balk die voor hetzelfde hoeveelheid gevuld is.
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${result.data.lovePercentage}`;
    progressBar.innerText = `${result.data.lovePercentage}`;

});