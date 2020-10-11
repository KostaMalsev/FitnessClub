const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open("GET", "https://rapidapi.p.rapidapi.com/v1_1/search/cheddar%20cheese?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat");
xhr.setRequestHeader("x-rapidapi-host", "nutritionix-api.p.rapidapi.com");
xhr.setRequestHeader("x-rapidapi-key", "5477ac9d35msh43acf850db9a5f0p12aa01jsn4821878eda80");

xhr.send(data);
