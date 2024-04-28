function getUrlProperty() {
  // Get iframe parameters
  const IFM_PARAMS =
    typeof window !== 'undefined' ? window.location.href.split('//')[1].split('/')[3] : 0

  console.log('执行')

  if (
    typeof IFM_PARAMS !== 'undefined' &&
    IFM_PARAMS.indexOf('[') < 0 &&
    IFM_PARAMS.indexOf(']') < 0
  ) {
    // 获取url
    const url = window.location.href

    const params = new URLSearchParams(url)

    let page_code = params.get('pageCode')
    let link_name = params.get('link_name')
    let link_value = params.get('link_value')
    let visit_id = params.get('visit_id')

    console.log('iiiiiiiiF:', link_value, visit_id)

    return {
      page_code: page_code,
      link_name: link_name,
      link_value: link_value,
      visit_id: visit_id,
    }
  } else {
    // 是iframe，解析iframe的参数
    return {
      link_value: getUrlVars().link_value,
      link_name: decodeURIComponent(getUrlVars().link_name),
      visit_id: getUrlVars().visit_id,
    }
  }
}

function getUrlVars() {
  const vars = {}
  const parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value
    },
  )
  return vars
}

export default getUrlProperty