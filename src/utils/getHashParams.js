function getHashSearchParam(key) {
  const url = location.href;
  //获取不包含 '#' 的hash值
  const hash = url.substring(url.indexOf("#") + 1);
  //查找 '?' 所在位置
  const searchIndex = hash.indexOf("?");
  //'?' 号后面接的是索引参数
  const search = searchIndex !== -1 ? hash.substring(searchIndex + 1) : "";
  //把搜索参数字符串通过URLSearchParams转换成对象
  const usp = new URLSearchParams(search);

  return usp.get(key);
}

export default getHashSearchParam;
