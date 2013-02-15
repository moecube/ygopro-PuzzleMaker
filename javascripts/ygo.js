
var types_zh = [
  'Monster','Zauber','Falle',null,'allgemein','Effekt','Union','Ritual','Fallen-Monster','Spirit','Allianz','Doppelklick','Anpassung','Kohomologie', null,'Ableitung',
  'Aufregung','Nachhaltige','Ausrüstung','Standort','Konter','drehen','Karikatur','Überschuss'
];
var attributes_zh = [
  'ERDE','WASSER','FEUER','WIND','LICHT','FINSTERNIS','GOTT'
];	  
var races_zh = [
  'Krieger','Hexer','Fee','Unterwelter','Zombie','Maschine','Aqua','炎族','Fels','geflügeltes Ungeheuer','Pflanze','Insekten','雷族',
  'Drachen','Ungeheuer','Ungeheuer-Krieger','Dinosaurier','Fisch','Seeschlange','Reptil','念动力族','Gott','创造神族'
];

var counters = [
{"code" : "0x3001" ,"str" : "test魔力指示物"},
{"code" : "0x2" ,	"str" : "楔指示物"},
{"code" : "0x3003" ,"str" : "武士道指示物"},
{"code" : "0x3004" ,"str" : "念力指示物"},
{"code" : "0x5" ,	"str" : "光指示物"},
{"code" : "0x6" ,	"str" : "宝玉指示物"},
{"code" : "0x7" ,	"str" : "指示物（剑斗兽之槛）"},
{"code" : "0x8" ,	"str" : "D指示物"},
{"code" : "0x9" ,	"str" : "毒指示物"},
{"code" : "0xa" ,	"str" : "次世代指示物"},
{"code" : "0x300b" ,"str" : "指示物（古代的机械城）"},
{"code" : "0xc" ,	"str" : "雷指示物"},
{"code" : "0xd" ,	"str" : "强欲指示物"},
{"code" : "0xe" ,	"str" : "A指示物"},
{"code" : "0xf" ,	"str" : "虫指示物"},
{"code" : "0x10" ,	"str" : "黑羽指示物"},
{"code" : "0x11" ,	"str" : "超毒指示物"},
{"code" : "0x12" ,	"str" : "机巧指示物"},
{"code" : "0x13" ,	"str" : "混沌指示物"},
{"code" : "0x14" ,	"str" : "指示物（奇迹之侏罗纪蛋）"},
{"code" : "0x15" ,	"str" : "冰指示物"},
{"code" : "0x16" ,	"str" : "魔石指示物"},
{"code" : "0x17" ,	"str" : "橡子指示物"},
{"code" : "0x18" ,	"str" : "花指示物"},
{"code" : "0x19" ,	"str" : "雾指示物"},
{"code" : "0x1a" ,	"str" : "倍倍指示物"},
{"code" : "0x1b" ,	"str" : "时计指示物"},
{"code" : "0x1c" ,	"str" : "D指示物"},
{"code" : "0x1d" ,	"str" : "废品指示物"},
{"code" : "0x1e" ,	"str" : "门指示物"},
{"code" : "0x1f" ,	"str" : "指示物（巨大战舰）"},
{"code" : "0x20" ,	"str" : "植物指示物"},
{"code" : "0x21" ,	"str" : "守卫指示物"},
{"code" : "0x22" ,	"str" : "龙神指示物"},
{"code" : "0x23" ,	"str" : "海洋指示物"},
{"code" : "0x24" ,	"str" : "弦指示物"},
{"code" : "0x25" ,	"str" : "年代记指示物"},
{"code" : "0x26" ,	"str" : "指示物（金属射手）"},
{"code" : "0x27" ,	"str" : "指示物（死亡蚊）"},
{"code" : "0x3028" ,"str" : "指示物（暗黑投射手）"},
{"code" : "0x29" ,	"str" : "指示物（气球蜥蜴）"},
{"code" : "0x2a" ,	"str" : "指示物（魔法防护器）"},
{"code" : "0x302b" ,"str" : "命运指示物"},
{"code" : "0x2c" ,	"str" : "遵命指示物"}
];
function getType(card){
	var result='';
	var type = card.type;
	for(var i in types_zh){
		if(type & (0x1<<i)){
			if(result=='')
				result = types_zh[i];
			else 
				result = result + "|" + types_zh[i];
		}
	}
	return result;
}
function getRace(card){
	var result;
	var race = card.race;
	for(var i in races_zh){
		if(race & (1<<i)){
			return races_zh[i];
		}
	}
}
function getAttribute(card){
	var result;
	var attribute = card.attribute;
	for(var i in races_zh){
		if(attribute & (1<<i)){
			return attributes_zh[i];
		}
	}
}