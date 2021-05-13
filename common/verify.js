
//验证是否为空
function IsNull(text){
	if(text==null || text.length<1) return true;
	text = text.toString().trim();
	let regex = /\S/;
	return !regex.test(text);
};
//验证整数
function IsInt(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^[-+]?\d+$/;
	return regex.test(text);
};
//验证double/float
function IsDouble(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^(([^0][0-9]*|[0])\.(\d+))$/;
	return regex.test(text);
};
//验证是否为数组整数/小数
function IsNumber(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^([-+]?)([0-9]+)(\.?)(\d*)$/;
	return regex.test(text);
};

//验证是否为合法11位手机号码
function IsPhone(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	if(text.length!=11) return false;
	let regex = /^[1][3-9]\d{9}/;
	return regex.test(text);
};

//验证是否为合法固定电话号码(金华地区)
function IsFixPhone(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	if(text.length<8) return false;
	let regex = /^0?(579)?8[1-9]{7}$/;
	return regex.test(text);
};

//验证是否为合法身份证号
function IsIDcard(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	if(text.length!=18 && text.length!=15) return false;
	if(text.length==18){
		if(CheckCode(text)) {
			var date = text.substring(6,14);
			if(CheckDate(date)) {
				if(CheckProvince(text.substring(0,2))) {
					return true;
				}
			}
		}
	}
	else{
		if(CheckProvince(text.substring(0,2))) {
			let regex = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/;
			return regex.test(text);
		}
	}
	return false;
};
//验证是否都为汉字
function IsChinese(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^[\u4e00-\u9fa5]+$/;
	return regex.test(text);
};
//验证是否为QQ号码
function IsQQ(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^[1-9][0-9]{4,}/;
	return regex.test(text);
};
//验证日期格式是否为YYYY-MM-DD格式
function IsDate(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^(\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/;
	return regex.test(text);			
};
//验证日期格式是否为YYYY-MM-DD hh:mm:ss格式
function IsDateTime(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^(\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	return regex.test(text);
};
//验证帐号是否合法 验证规则：字母、数字、下划线组成，字母开头，5-16位
function IsAccount(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^[a-zA-Z]\w{4,15}$/;
	return regex.test(text);
};
//验证帐号是否合法 验证规则：字母、数字、下划线组成6-18位
function IsPassword(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /[A-Za-z0-9_.]{6,18}$/;
	return regex.test(text);
};
//验证邮箱是否合法
function IsEmail(text){
	if(text==null || text.length<1) return false;
	text = text.toString().trim();
	let regex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	return regex.test(text);
}

export default{
	IsNull,
	IsInt,
	IsDouble,
	IsNumber,
	IsPhone,
	IsFixPhone,
	IsIDcard,
	IsChinese,
	IsQQ,
	IsDate,
	IsDateTime,
	IsAccount,
	IsPassword,
	IsEmail
}

/*********************辅助方法*********************/

//验证省份代码
var CheckProvince = function (val) {
    var pattern = /^[1-9][0-9]/;
    var provs = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
				 21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",
				 33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
				 41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",
				 46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",
				 54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
				 65:"新疆",71:"台湾",81:"香港",82:"澳门"};
    if(pattern.test(val)) {
        if(provs[val]) return true;
    }
    return false;
}
//验证出生日期
var CheckDate = function (val) {
    var pattern = /^(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
    if(pattern.test(val)) {
        var year = val.substring(0, 4);
        var month = val.substring(4, 6);
        var date = val.substring(6, 8);
        var date2 = new Date(year+"-"+month+"-"+date);
        if(date2 && date2.getMonth() == (parseInt(month) - 1)) return true;
    }
    return false;
}
//最后一位校验码校验
var CheckCode = function (val) {
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    var code = val.substring(17);
    if(p.test(val)) {
        var sum = 0;
        for(var i=0;i<17;i++) {
            sum += val[i]*factor[i];
        }
        if(parity[sum % 11] == code.toUpperCase()) {
            return true;
        }
    }
    return false;
}
