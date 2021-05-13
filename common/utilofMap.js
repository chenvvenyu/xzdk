function IsPtInPoly(aLat, aLon, pointList) {
	
	//1.搜索框输入模糊地址，经纬度会少一位
	//2.
	console.log('aLat',aLat)
	console.log('aLon',aLon)
	console.log('pointList',pointList)
	
    /* 
    :param aLon: double 经度 
    :param aLat: double 纬度 
    :param pointList: list [{latitude: 22.22, longitude: 113.113}...] 多边形点的顺序需根据顺时针或逆时针，不能乱 
    */
    var iSum = 0  
    var iCount = pointList.length
      
    if(iCount < 3) {
        return false 
    }
    for(var i = 0; i < iCount;i++) {
        var pLat1 = pointList[i].latitude  
        var pLon1 = pointList[i].longitude
        if(i == iCount - 1) {
            var pLat2 = pointList[0].latitude
            var pLon2 = pointList[0].longitude
        } else {
            var pLat2 = pointList[i + 1].latitude  
            var pLon2 = pointList[i + 1].longitude
        }
        if (((aLat >= pLat1) && (aLat < pLat2)) || ((aLat>=pLat2) && (aLat < pLat1))) {
            if (Math.abs(pLat1 - pLat2) > 0) {
                var pLon = pLon1 - ((pLon1 - pLon2) * (pLat1 - aLat)) / (pLat1 - pLat2);  
                if(pLon < aLon) {
                    iSum += 1 
                }
            }
        } 
    }
    if(iSum % 2 != 0) {
        return true  
    }else {
        return false 
    }  
}
function IsPtInPoly1(point,pts){
	// console.log('point',point)
	// console.log('pts',pts)
	var N = pts.length;
	        var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
	        var intersectCount = 0;//cross points count of x 
	        var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
	        var p1, p2;//neighbour bound vertices
	        var p = point; //测试点
	        
	        p1 = pts[0];//left vertex        
	        for(var i = 1; i <= N; ++i){//check all rays            
	            if(p.lng == p1.longitude && p.lat == p1.latitude){
	                return boundOrVertex;//p is an vertex
	            }
	            
	            p2 = pts[i % N];//right vertex            
	            if(p.lat < Math.min(p1.latitude, p2.latitude) || p.lat > Math.max(p1.latitude, p2.latitude)){//ray is outside of our interests                
	                p1 = p2; 
	                continue;//next ray left point
	            }
	            
	            if(p.lat > Math.min(p1.latitude, p2.latitude) && p.lat < Math.max(p1.latitude, p2.latitude)){//ray is crossing over by the algorithm (common part of)
	                if(p.lng <= Math.max(p1.longitude, p2.longitude)){//x is before of ray                    
	                    if(p1.latitude == p2.latitude && p.lng >= Math.min(p1.longitude, p2.longitude)){//overlies on a horizontal ray
	                        return boundOrVertex;
	                    }
	                    
	                    if(p1.longitude == p2.longitude){//ray is vertical                        
	                        if(p1.longitude == p.lng){//overlies on a vertical ray
	                            return boundOrVertex;
	                        }else{//before ray
	                            ++intersectCount;
	                        } 
	                    }else{//cross point on the left side                        
	                        var xinters = (p.lat - p1.latitude) * (p2.longitude - p1.longitude) / (p2.latitude - p1.latitude) + p1.longitude;//cross point of lng                        
	                        if(Math.abs(p.lng - xinters) < precision){//overlies on a ray
	                            return boundOrVertex;
	                        }
	                        
	                        if(p.lng < xinters){//before ray
	                            ++intersectCount;
	                        } 
	                    }
	                }
	            }else{//special case when ray is crossing through the vertex                
	                if(p.lat == p2.latitude && p.lng <= p2.longitude){//p crossing over p2                    
	                    var p3 = pts[(i+1) % N]; //next vertex                    
	                    if(p.lat >= Math.min(p1.latitude, p3.latitude) && p.lat <= Math.max(p1.latitude, p3.latitude)){//p.lat lies between p1.lat & p3.lat
	                        ++intersectCount;
	                    }else{
	                        intersectCount += 2;
	                    }
	                }
	            }            
	            p1 = p2;//next ray left point
	        }
	        
	        if(intersectCount % 2 == 0){//偶数在多边形外
	            return false;
	        } else { //奇数在多边形内
	            return true;
	        } 
}
function GetDistance(lat1, lng1, lat2, lng2){
	lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
	var a = radLat1 - radLat2;
	var  b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
	Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
	s = s *6378.137 ;// EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000; //输出为公里
	//s=s.toFixed(2);
	return s;
}


module.exports = {
    IsPtInPoly,
	IsPtInPoly1,
	GetDistance
};