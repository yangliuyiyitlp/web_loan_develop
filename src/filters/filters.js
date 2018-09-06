let formatDates = time => {  
    if(time){  
    	return new Date(parseInt(time)).toJSON().slice(0,10)
//      return time.slice(5,16)  
    }  
}
let formatMobile = value => {
	if(value) {
		return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
	}
}
let formatTimes = time => { //如2018-08-13 11:07:27 ==> 2018-08-13 11:07 
    if(time && time != null){  
    	let num = time.lastIndexOf(":")
    	return time.slice(0,num)
    } else {
    	return ''
    }
}
export { formatDates,formatMobile, formatTimes }  