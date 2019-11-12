import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf'
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highcharts);

export function toDataURL(_svg, type, options) {
	function defaultDebug(s) {
		console.log("SVG.toDataURL:", s);
	}
	var debug = options && options.debug ? options.debug : defaultDebug;
	// var myCanvg = options && options.canvg ? options.canvg : typeof canvg === 'function' ? canvg : window.canvg;

	function exportSVG() {
		var svg_xml = XMLSerialize(_svg);
		var svg_dataurl = base64dataURLencode(svg_xml);
		debug(type + " length: " + svg_dataurl.length);

		// NOTE double data carrier
		if (options.callback) options.callback(svg_dataurl);
		return svg_dataurl;
	}

	function XMLSerialize(svg) {

		// quick-n-serialize an SVG dom, needed for IE9 where there's no XMLSerializer nor SVG.xml
		// s: SVG dom, which is the <svg> elemennt
		function XMLSerializerForIE(s) {
			var out = "";

			out += "<" + s.nodeName;
			for (var n = 0; n < s.attributes.length; n++) {
				out += " " + s.attributes[n].name + "=" + "'" + s.attributes[n].value + "'";
			}

			if (s.hasChildNodes()) {
				out += ">\n";

				for (var n = 0; n < s.childNodes.length; n++) {
					out += XMLSerializerForIE(s.childNodes[n]);
				}

				out += "</" + s.nodeName + ">" + "\n";

			} else out += " />\n";

			return out;
		}


		if ((window as any).XMLSerializer) {
			debug("using standard XMLSerializer.serializeToString")
			return (new XMLSerializer()).serializeToString(svg);
		} else {
			debug("using custom XMLSerializerForIE")
			return XMLSerializerForIE(svg);
		}

	}

	function base64dataURLencode(s) {
		var b64 = "data:image/svg+xml;base64,";

		// https://developer.mozilla.org/en/DOM/window.btoa
		if (window.btoa) {
			debug("using window.btoa for base64 encoding");
			b64 += btoa(s);
		}

		return b64;
	}

	function exportImage(type) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');

		// TODO: if (options.keepOutsideViewport), do some translation magic?

		var svg_img = new Image();
		var svg_xml = XMLSerialize(_svg);
		svg_img.src = base64dataURLencode(svg_xml);

		svg_img.onload = function () {
			debug("exported image size: " + [svg_img.width, svg_img.height])
			canvas.width = svg_img.width;
			canvas.height = svg_img.height;
			ctx.drawImage(svg_img, 0, 0);

			// SECURITY_ERR WILL HAPPEN NOW
			var png_dataurl = canvas.toDataURL(type);
			debug(type + " length: " + png_dataurl.length);

			if (options.callback) options.callback(png_dataurl);
			else debug("WARNING: no callback set, so nothing happens.");
		}

		svg_img.onerror = function () {
			console.log(
				"Can't export! Maybe your browser doesn't support " +
				"SVG in img element or SVG input for Canvas drawImage?\n" +
				"http://en.wikipedia.org/wiki/SVG#Native_support"
			);
		}

		// NOTE: will not return anything
	}

	function exportImageCanvg(type) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');
		var svg_xml = XMLSerialize(_svg);

		// NOTE: canvg gets the SVG element dimensions incorrectly if not specified as attributes
		//debug("detected svg dimensions " + [_svg.clientWidth, _svg.clientHeight])
		//debug("canvas dimensions " + [canvas.width, canvas.height])

		var keepBB = options.keepOutsideViewport;
		if (keepBB) var bb = _svg.getBBox();

		// NOTE: this canvg call is synchronous and blocks
		// myCanvg(canvas, svg_xml, { 
		// 	ignoreMouse: true, ignoreAnimation: true,
		// 	offsetX: keepBB ? -bb.x : undefined, 
		// 	offsetY: keepBB ? -bb.y : undefined,
		// 	scaleWidth: keepBB ? bb.width+bb.x : undefined,
		// 	scaleHeight: keepBB ? bb.height+bb.y : undefined,
		// 	renderCallback: function() {
		// 		debug("exported image dimensions " + [canvas.width, canvas.height]);
		// 		var png_dataurl = canvas.toDataURL(type);
		// 		debug(type + " length: " + png_dataurl.length);

		// 		if (options.callback) options.callback( png_dataurl );
		// 	}
		// });

		// NOTE: return in addition to callback
		return canvas.toDataURL(type);
	}

	// BEGIN MAIN

	if (!type) type = "image/svg+xml";
	if (!options) options = {};

	if (options.keepNonSafe) debug("NOTE: keepNonSafe is NOT supported and will be ignored!");
	if (options.keepOutsideViewport) debug("NOTE: keepOutsideViewport is only supported with canvg exporter.");

	switch (type) {
		case "image/svg+xml":
			return exportSVG();
			break;

		case "image/png":
		case "image/jpeg":

			if (!options.renderer) {
				// if (window.canvg) options.renderer = "canvg";
				options.renderer = "native";
			}

			switch (options.renderer) {
				case "canvg":
					debug("using canvg renderer for png export");
					return exportImageCanvg(type);
					break;

				case "native":
					debug("using native renderer for png export. THIS MIGHT FAIL.");
					return exportImage(type);
					break;

				default:
					debug("unknown png renderer given, doing noting (" + options.renderer + ")");
			}

			break;

		default:
			debug("Sorry! Exporting as '" + type + "' is not supported!")
	}
}

@Component({
	selector: 'app-step1',
	templateUrl: './step1.component.html',
	styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit, AfterViewInit {

	Highcharts = Highcharts;

	chartUpdateFlag = true;
	pieChartLeaseOptions = this.setPieChartConfig();
	pieChartLease: Highcharts.Chart;

	formGroup: FormGroup;
	@Output() formGroupOut = new EventEmitter<FormGroup>();

	constructor(
		private _formBuilder: FormBuilder
	) { }

	ngOnInit() {
		this.formGroup = this._formBuilder.group({
			stepLabel: 'Customer',
			firstCtrl: ['', Validators.required]
		});
		this.formGroupOut.emit(this.formGroup);

	}

	toggleUpdateChartsFlag() {
		setTimeout(() => this.chartUpdateFlag = !this.chartUpdateFlag);
	}

	ngAfterViewInit() {
		this.toggleUpdateChartsFlag();
		this.pieChartLeaseOptions.series[0].data = this.generatePieChartData();
		this.pieChartLeaseOptions.title.text = 'Lease';
		this.pieChartLeaseOptions.subtitle.text = `Total revenue: ...`;
		this.toggleUpdateChartsFlag();

	}

	downloadPdf() {

		var render_width = 500;
		// var render_height = this.pieChartLease.chartHeight;
		var render_height = 350;
		// var render_height = render_width * this.pieChartLease.chartHeight / this.pieChartLease.chartWidth

		// var ddd = this.pieChartLease.chartWidth;
		// var www = this.pieChartLease.chartHeight;

		// console.log('ddd', ddd);
		// console.log('www', www);

		var svg = this.pieChartLease.getSVG();

		// var svg = this.pieChartLease.getSVG({
		// 	exporting: {
		// 		sourceWidth: render_width,
		// 		sourceHeight: this.pieChartLease.chartHeight
		// 	}
		// });

		var canvas = document.createElement('canvas');
		canvas.height = render_height;
		canvas.width = render_width;

		const doc = new jsPDF();
		var image = new Image;
		image.onload = this.imageHandler(canvas, doc);
		image.src = 'data:image/svg+xml;base64,' + window.btoa(svg);

	}

	imageHandler(canvas: HTMLCanvasElement, doc: jsPDF) {
		return function () {
			canvas.getContext('2d').drawImage((this as HTMLImageElement), 0, 0);
			var data = canvas.toDataURL("image/png")
			doc.text(35, 25, 'Paranyan loves jsPDF');
			doc.addImage(data, 'PNG', 0, 40);
			doc.save('Test.pdf');

		};
	}

	downloadPdf22() {

		const chartSVG = this.pieChartLease.getSVG();

		// Use DOMParser to parse new svg element from svgString
		// const parser = new DOMParser(); 
		// const svgElem = parser.parseFromString(chartSVG, "image/svg+xml").documentElement;

		// Use toDataURL extension to generate Base64 string
		// let b64 = toDataURL(chartSVG);
		// console.log('b64', b64);

		const doc = new jsPDF();
		doc.text(35, 25, 'Paranyan loves jsPDF');
		// doc.fromHTML(document.getElementById('svgId1').outerHTML, 15, 40)
		doc.addSVG(chartSVG, 15, 40, 180, 160);
		// doc.addSVG(this.svgImage1, 15, 40, 180, 160);
		// doc.addImage(this.svgImage1, 'SVG', 15, 40, 180, 160);
		doc.save('Test.pdf');
	}

	generatePieChartData() {

		const results_netProfit10Year = 111;
		const results_currentEquipmentInvestment = 222;
		const results_tenYearLabor = 333;

		const result = [{
			name: 'Net Income',
			y: results_netProfit10Year,
			val: `$${results_netProfit10Year.toLocaleString()}`,
			sliced: true,
			selected: true
		}, {
			name: 'Equipment',
			y: results_currentEquipmentInvestment,
			val: `$${results_currentEquipmentInvestment.toLocaleString()}`
		}, {
			name: 'Labor',
			y: results_tenYearLabor,
			val: `$${results_tenYearLabor.toLocaleString()}`
		}];

		return result;

	}

	setPieChartConfig() {
		return {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			tooltip: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b> <br> {point.val}'
					}
				}
			},
			series: [{
				colorByPoint: true,
				data: []
			}
			]
		};
	}

}
