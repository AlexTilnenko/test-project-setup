//добавляю ноль к числу меньше 10 для даты
export const addZero = (num) => {
	return +num < 10 ? `0${num}` : num;
};

export const filterByParam = (arr, param, objProp, equal) => {
	return arr.filter((item) => (equal ? item[objProp] === param : item[objProp] !== param));
};

export const filterByTerm = (arr, objProp, term) => {
	return arr.filter((item) => item[objProp].indexOf(term) > -1);
};
