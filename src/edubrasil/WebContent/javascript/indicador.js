var dataset = [];
var rawdata = [];

function getMenuOption(sel) {
    var value = sel.options[sel.selectedIndex].value;
	rawdata = dataset.filter(function(i){return i.NOME_MUNICIPIO == value;})
	
	
   // plotIndicadores("");
   // plotSeries(""); 
   // plotSeries(value); 
   // plotIndicadores(value);   
    
};

var parseDate = d3.time.format("%Y").parse;	



function loadData() {
		d3.csv("data/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv" , function (data){
			data.forEach(function(d){
				//d.ANO = parseDate(d.ANO);
			});
			dataset = data;
			
			myList = d3.selectAll("#myList");
			myList.selectAll("option").data(dataset).enter().append("option")
			.attr("value",function(d){return d.NOME_MUNICIPIO;})
			.attr("label",function(d){return d.NOME_MUNICIPIO;})
			
		});
		d3.csv("data/dicionario.csv" , function (data){			
			
		var div_buttons = d3.select("#div_indicador_options");	
		
		div_buttons.selectAll("input")
		.data(data)
		.enter()
		.append("input")
		.attr("type","button")
		.attr("class","button rightmenuup")
		.attr("value", function (d){return d.name;})
		.attr("id", function (d, i){return d.id;})
		.style("color", "black")
		.style("background-color", "red")
		.on("click", function(d) {
			plotIndicadores(d.id);
		});			
		});
};

function plotIndicadores(indicador) {
// e se todos forem NAs?
// 

	//Width and height
	var w = 600;
	var h = 250;
	
	if(rawdata.length != 0){
		var maxYear = d3.max(rawdata.filter(function(d){return d[indicador] != "NA";}).map(function(d){return parseInt(d.ANO)}));
		
		var currentYearData = rawdata.filter(function(d){return d.ANO == maxYear;})[0];
		
		var subset = [10, currentYearData[indicador]];
		
		var xScale = d3.scale.ordinal().domain(d3.range(subset.length))
		.rangeRoundBands([ 0, w ], 0.05);
	
		var yScale = d3.scale.linear().domain([ 0, d3.max(subset) ])
		.range([ 0, h ]);
	
		//Create SVG element
		var svg = d3.select("#div_indicador").select("svg");
		
		if (svg[0][0] == null){
			//cria novas barras
			
			var svg = d3.select("#div_indicador").append("svg").attr("width", w).attr("height", h);
			
			svg.selectAll("rect").data(subset).enter().append("rect").attr(
			"x", function(d, i) {
				return xScale(i);
			}).attr("y", function(d) {
				return h - yScale(d);
			}).attr("width", xScale.rangeBand()).attr("height", function(d) {
				return yScale(d);
			}).attr("fill", function(d) {
				return "rgb(0, 0, " + (d * 20) + ")";
			}).on(
					"mouseover",
					function(d) {

						//Get this bar's x/y values, then augment for the tooltip
						var xPosition = parseFloat(d3.select(this).attr("x"))
						+ xScale.rangeBand() / 2;
						var yPosition = parseFloat(d3.select(this).attr("y"))
						/ 2 + h / 2;

						//Update the tooltip position and value
						d3.select("#tooltip").style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#value").text(d);

						//Show the tooltip
						d3.select("#tooltip").classed("hidden", false);

					}).on("mouseout", function() {

						//Hide the tooltip
						d3.select("#tooltip").classed("hidden", true);

					}).on("click", function() {
						//sortBars();
					});
			
		}else{
			
			var bars = d3.select("#div_indicador").select("svg").selectAll("rect")
			.data(subset)
			.transition()
			.attr("y", function(d) {
				return h - yScale(d);
			});
		}
	
		
		//Define sort order flag
		var sortOrder = false;
	
		//Define sort function
		var sortBars = function() {
	
			//Flip value of sortOrder
			sortOrder = !sortOrder;
	
			svgBar.selectAll("rect").sort(function(a, b) {
				if (sortOrder) {
					return d3.ascending(a, b);
				} else {
					return d3.descending(a, b);
				}
			}).transition().delay(function(d, i) {
				return i * 50;
			}).duration(1000).attr("x", function(d, i) {
				return xScale(i);
			});
	
		};		
	}else{
		d3.select("svg").remove();
	}
	
};

