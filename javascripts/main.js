
var _popmenu;
var dragging = false;
var putting = false;
var selectingEquip;
var selectingContinuous;
var thumb_equip;
var thumb_equip_target;
var thumb_continuous;
var thumb_continuous_target;
var isIE = /*@cc_on!@*/!1;
var current_page ;
var page_num;
var table_row = 6;//Math.floor((getViewSize().h-250)/64);
var MZONE = 0;
var SZONE = 1;
var FIELD = 2;
var DECK = 3;
var HAND = 4;
var GRAVE = 5;
var EXTRA = 6;
var REMOVED = 7;
var LOCATION_STRING = ['mzone','szone','field','deck','hand','grave','extra','removed'];
var PLAYER_1 = [
{"top": 138, "left": 71}, //mzone
{"top": 64, "left": 71},  //szone
{"top": 99, "left": 408}, //field
{"top": 20, "left": 8},   //deck
{"top": -13, "left": 71}, //hand
{"top": 99, "left": 8},   //grave
{"top": 20, "left": 408}, //extra
{"top": 178, "left": 8},  //removed
];
var PLAYER_0 = [
{"top": 265, "left": 71}, //mzone
{"top": 339, "left": 71}, //szone
{"top": 302, "left": 8},  //field
{"top": 382, "left": 408},//deck
{"top": 416, "left": 71}, //hand
{"top": 302, "left": 408},//grave
{"top": 382, "left": 8},  //extra
{"top": 222, "left": 408},//removed
];
var COORDINATE = [PLAYER_0,PLAYER_1];

var locale = 'de';
var cards_url = "http://my-card.in/cards";
//var cards_url = "../../cards";
var locale_url = "http://my-card.in/cards_" + locale;

var card_img_url = "http://dev-pro.org/puzzle/pics/";

var card_img_thumb_url = "http://dev-pro.org/puzzle/pics/thumbnail/";

var datas = new Object();

function search(){
	var name = document.getElementById("keyword").value;
	var page_button = document.getElementById("page_button");
	if(name == "")
		return false;
	var q = JSON.stringify( {name: {$regex: name.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), $options: 'i'}});
	var url = locale_url + '?q=' + q;
    $.getJSON(url,function(result){
		var html = "";
		if(result.length == 0){
			setPageLabel();
			page_button.style.display = 'none';
			$("#result").html(html);
			alert("未找到相关卡片");
			return false;
		}
		var cards_id = [];
		for (var _i in result) {
			cards_id.push(result[_i]._id);
		}
		$.getJSON(cards_url + "?q=" + (JSON.stringify({_id: {$in: cards_id}})), function(cards) {
			for(var i in cards){
				var card = cards[i];
				var name = '';
				var desc = '';
				for(var j in result){
					if(result[j]._id == card._id){
						name = result[j].name;
						desc = result[j].desc;
						break;
					}
				}
				var data = {
					"_id": card._id,
					"name": name,
					"type": getType(card),
					"atk": card.atk,
					"def": card.def,
					"level": card.level,
					"race": getRace(card),
					"attribute": getAttribute(card),
					"desc": desc
				};
				datas[card._id]=data;
			}
			current_page = 1;
			page_num = 0;
			$.each(result, function(i, card){
				if(i%table_row==0){
					page_num ++;
					html = html + "<table class='page' style='display:none'>";
					html = html + "<tr>";
					html = html + "<th width='46px'>Bild</th>";
					html = html + "<th >Name</th>";
					html = html + "</tr>";
				}
				html = html + "<tr>";
				html = html + "<td><img class='thumb' src='" + card_img_thumb_url + card._id + ".jpg' style='cursor:pointer;'>" + "</td>";
				html = html + "<td width=200px><div class='cardname'>" + card.name + "</div></td>";
				html = html + "</tr>";
				if(((i+1)%table_row==0) || (i==result.length)){
					html = html+ "</table>";
				}
			});
			var tables = document.getElementById("result");
			$(tables).html(html);
			tablecloth();
			page_button.style.display = 'block';
			setPageLabel(current_page, page_num);
			showPage(current_page);
			var thumbs = tables.getElementsByClassName("thumb");
			for (var i=0; i< thumbs.length;i++){
				makeDraggable(thumbs[i]);
			}
		});
	});
}
function initField(){
	var player, place;
	for(player=0;player<2;player++){
		for(place=0;place<5;place++)
			addField(player,SZONE,place);
		for(place=0;place<5;place++)
			addField(player,MZONE,place);
		addField(player,FIELD,0);
		addField(player,DECK,0);
		addField(player,HAND,0);
		addField(player,GRAVE,0);
		addField(player,EXTRA,0);
		addField(player,REMOVED,0);
	}
	var fields = document.getElementById("fields").getElementsByTagName("div");
	for(var i=0; i< fields.length;i++){
		var card_list = [];
		$.data(fields[i], 'card_list', card_list);
		fields[i].onmouseover = function(){
			if(dragging == false && putting == true){
				putting = false;
				var dragImage  = document.getElementById('DragImage');
				var card_info = $.data(dragImage, 'card_info');
				addCard(this, card_info);
			}
		}
	}
	var dragImage  = document.getElementById('DragImage');
	dragImage.onmouseover = function(){
		var card_info = $.data(dragImage, 'card_info');
		var card_id = card_info.card_id;
		showDetail(card_id);
	}
	var download = document.getElementById('download');
	download.onmouseover = downloadURL;
	var keyword = document.getElementById('keyword');
	keyword.onkeypress = function(ev){
		var ev = ev || window.event;
		var key = ev.keyCode;
		if(key == 13){
			search();
		}
	};
	_popmenu = new PopMenu;

	/*黑羽 for test*/
	current_page = 1;
	page_num = 0;
	html = "";
	for( var i in default_result){
	
		var card = default_result[i];
		datas[card._id]=card;
		if(i%table_row==0){
			page_num ++;
			html = html + "<table class='page' style='display:none'>";
			html = html + "<tr>";
			html = html + "<th width='46px'>卡图</th>";
			html = html + "<th >卡名</th>";
			html = html + "</tr>";
		}
		html = html + "<tr>";
		html = html + "<td><img class='thumb' src='" + card_img_thumb_url + card._id + ".jpg' style='cursor:pointer;'>" + "</td>";
		html = html + "<td width=200px><div class='cardname'>" + card.name + "</div></td>";
		html = html + "</tr>";
		if(((i+1)%table_row==0) || (i==default_result.length)){
			html = html+ "</table>";
		}
	}
	var tables = document.getElementById("result");
	$(tables).html(html);
	tablecloth();
	page_button.style.display = 'block';
	setPageLabel(current_page, page_num);
	showPage(current_page);
	var thumbs = tables.getElementsByClassName("thumb");
	for (var i=0; i< thumbs.length;i++){
		makeDraggable(thumbs[i]);
	}
}
function prePage(){ //上一页
	if(current_page == 1) return false;
	current_page--;
	setPageLabel(current_page, page_num);
	showPage(current_page);
}
function nextPage(){//下一页
	if(current_page == page_num) return false;
	current_page++;
	setPageLabel(current_page, page_num);
	showPage(current_page)
}
function showPage(current_page){//显示current页
	var tables = document.getElementsByTagName('table');
	for(var i=0; i<tables.length; i++){
		if(i == current_page -1) //current为1时显示table[0]
			tables[i].style.display = "block";
		else
			tables[i].style.display = "none";
	}
}
function setPageLabel(current_page, page_num) {//显示第X页/共X页
	var page_label = $('.page_label');
	var built = $('#page-tmpl').tmpl({
		current_page: current_page || 0,
		page_num: page_num || 0
	});
	page_label.html(built);
}
function addField(player, location, place) {//画场地
	var top, left;
	top = COORDINATE[player][location].top;
	left = COORDINATE[player][location].left + 66*place;
	if(location == MZONE || location == SZONE){
		if(player == 0){
			top = COORDINATE[player][location].top;
			left = COORDINATE[player][location].left + 66*place;
		}
		else {
			top = COORDINATE[player][location].top;
			left = COORDINATE[player][location].left + 66*(4-place);
		}
	}
	$('#field-tmpl').tmpl({
		player: player || 0,
		location: LOCATION_STRING[location] || 0,
		place: place || 0,
		top: top,
		left: left
	}).appendTo($('#fields'));
}
function addCard(field, card_info){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	if(location == "szone" || location == "field"){ //魔陷区和场地区最多只能有1张卡
		card_list = [];
	}
	card_list.push(card_info);
	$.data(field, 'card_list', card_list);
	updateField(field);
}

function updateField(field){
	var tmplItem = $(field).tmplItem().data;
	var location = tmplItem.location;
	var card_list = $.data(field, 'card_list');
	$(field).empty();
	var width = $(field).width();
	var length = card_list.length;
	var start = width/2 - 22.5*length;
	for(var i in card_list){
		var card_info = card_list[i];
		card_info.location = tmplItem.location;
		card_info.player = tmplItem.player;
		card_info.place = tmplItem.place;
		card_info.index = i;
		var top, left, right, bottom;
		if(45 < (width / length)) 
			left = start + 45*i ;
		else 
			left = (width-45)/(length-1)*i;
		$("#thumb-tmpl").tmpl({
			card_info: card_info,
			top: top || 3,
			left: left || 0,
			right: right || 0,
			bottom: bottom || 0,
			card_img_thumb_url: card_img_thumb_url
		}).appendTo(field);
	}
	var thumbs = field.getElementsByClassName("thumb");
	for (var i=0; i<thumbs.length; i++){
		makeMoveable(thumbs[i]);
	}
	updateCards(thumbs);
	if(0 != length){
		var type;
		var text = "";
		if(location == "grave" || location == "deck" || location == "extra" || location == "removed"){
			type = "field_group_count";
			text = length;
		}
		else if(location == "mzone"){
			type = "monster_ad";
			var card_info = card_list[length-1];
			var data = datas[card_info.card_id];
			var atk = data.atk;
			var def = data.def;
			if(atk < 0){atk = "?";}
			if(def < 0){def = "?";}
			text = atk + "/" + def;
		}
		$("#label_field-tmpl").tmpl({
			type: type,
			text: text
		}).appendTo(field);
	}
}
function updateCards(thumbs){	
	for (var i=0; i<thumbs.length; i++){
		var thumb = thumbs[i];
		var tmplItem = $(thumb).tmplItem().data;
		var card_info = tmplItem.card_info;
		var location = card_info.location;
		var card_id = card_info.card_id;
		if(location == "szone" || location == "field"){ //魔陷区和场地区只分表侧和里侧
			if(card_info.position == "POS_FACEDOWN_ATTACK" || card_info.position == "POS_FACEDOWN_DEFENCE")
				tmplItem.card_info.position = "POS_FACEDOWN_ATTACK";
			else
				tmplItem.card_info.position = "POS_FACEUP_ATTACK";
		}
		else if(location == "mzone"){
			if(1 < thumbs.length && i < thumbs.length-1){//超量素材
				tmplItem.card_info.position = "POS_FACEUP_ATTACK";
				tmplItem.card_info.IsXYZmaterial = true;
			}
			else {
				tmplItem.card_info.IsXYZmaterial = false;
			}
		}
		else if(location != "mzone"){//除魔陷和怪兽区
			tmplItem.card_info.position = "POS_FACEUP_ATTACK";
		}
		if(tmplItem.card_info.position == "POS_FACEUP_ATTACK"){
			if(isIE){
				thumb.style.top = tmplItem.top + "px";
				thumb.style.left = tmplItem.left + "px";
			}
			else {
				thumb.style.left = tmplItem.left + "px";
			}
			thumb.src = card_img_thumb_url + card_id + ".jpg";
			Img.rotate(thumb, 0, true);
		}
		else if(tmplItem.card_info.position == "POS_FACEUP_DEFENCE"){
			if(isIE){
				thumb.style.top = 13 + "px";
				thumb.style.left = 0 + "px";
			}
			else {
				thumb.style.left = 10 + "px";
			}
			thumb.src = card_img_thumb_url + card_id + ".jpg";
			Img.rotate(thumb, -90, true);
		}
		else if(tmplItem.card_info.position == "POS_FACEDOWN_DEFENCE"){
			if(isIE){
				thumb.style.top = 13 + "px";
				thumb.style.left = 0 + "px";
			}
			else {
				thumb.style.left = 10 + "px";
			}
			thumb.src = "images/unknow.jpg";
			Img.rotate(thumb, -90, true);
		}
		else if(tmplItem.card_info.position == "POS_FACEDOWN_ATTACK"){
			if(isIE){
				thumb.style.top = tmplItem.top + "px";
				thumb.style.left = tmplItem.left + "px";
			}
			else {
				thumb.style.left = tmplItem.left + "px";
			}
			thumb.src = "images/unknow.jpg";
			Img.rotate(thumb, 0, true);
		}
	}
}

function showDetail(card_id){
	var img = document.getElementById("detail_image");
	img.src = card_img_url + card_id + ".jpg";
	var data = datas[card_id];
	//$('#detail_label').html($('#detail-tmpl').tmpl({detail: data}));
	var textarea = document.getElementById("detail_textarea");
	textarea.value = data.desc;
}
function mouseDown(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	_popmenu.hide();
	if(target.onmousedown){
		return false;
	}
}
var up;
function mouseUp(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	if(ev.button == 0 || ev.button == 1){//鼠标左键，ie是0，其他是1
		var dragImage  = document.getElementById('DragImage');
		if(dragging){
			dragging = false;
			putting = true;
			dragImage.style.display = "none";
			Img.rotate(dragImage, 0, true);
			up = true;
		}
	}
	if(target.oncontextmenu){
		return false;
	}
}
function mouseMove(ev){
	ev         = ev || window.event;
	var target   = ev.target || ev.srcElement;
	var mousePos = getMousePos(ev);
	if(dragging){
		var dragImage  = document.getElementById('DragImage');
		dragImage.style.position = 'absolute';
		dragImage.style.left     = mousePos.x - 22 + "px";
		dragImage.style.top      = mousePos.y - 32 + "px";
		dragImage.style.display  = "block";
	}
	if(!up)
		putting = false;
	else 
		up = false;
}
function getMousePos(ev){
	ev         = ev || window.event;
	var target = ev.target || ev.srcElement;
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}
function checkNums() {
	var key = window.event.keyCode;
	if (key >= 48 && key <= 57 || key == 8) {
	}
	else {
		return false;
	}
}
function checkLetter() {
	var key = window.event.keyCode;
	if (key >= 65 && key <= 97) {
	}
	else {
		return false;
	}
}

function getViewSize(){
	return {w: window['innerWidth'] || document.documentElement.clientWidth,
	h: window['innerHeight'] || document.documentElement.clientHeight}
}
function getFullSize(){
	return {w: window.screen.width, h: window.screen.height}
}
function del(array,n){
	var result = [];
	for(var i in array){
		if(i != n)
			result.push(array[i]);
	}
	return result;
}
document.onmousemove = mouseMove;
document.onmousedown = mouseDown;
document.onmouseup   = mouseUp;
document.oncontextmenu = mouseUp;
